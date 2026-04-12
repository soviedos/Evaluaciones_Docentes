import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadPanel } from "@/features/evaluacion-docente/components/upload/upload-panel";

// Mock the API module
vi.mock("@/features/evaluacion-docente/lib/api/documents", () => ({
  uploadDocument: vi.fn(),
  ApiClientError: class ApiClientError extends Error {
    body: unknown;
    constructor(status: number, statusText: string, body: unknown) {
      super(`API error: ${status} ${statusText}`);
      this.name = "ApiClientError";
      this.body = body;
    }
  },
}));

import { uploadDocument } from "@/features/evaluacion-docente/lib/api/documents";
const mockUpload = vi.mocked(uploadDocument);

function makePdf(name = "test.pdf") {
  return new File(["pdf-content"], name, { type: "application/pdf" });
}

describe("UploadPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card with title and drop zone", () => {
    render(<UploadPanel />);

    expect(screen.getByText("Subir archivos")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Zona de carga/ }),
    ).toBeInTheDocument();
  });

  it("shows file list after selecting files", async () => {
    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("evaluacion.pdf"));

    expect(screen.getByText("evaluacion.pdf")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText(/Subir 1 archivo(?!s)/)).toBeInTheDocument();
  });

  it("shows plural text for multiple files", async () => {
    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, [makePdf("a.pdf"), makePdf("b.pdf")]);

    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
    expect(screen.getByText(/Subir 2 archivos/)).toBeInTheDocument();
  });

  it("prevents duplicate filenames", async () => {
    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("same.pdf"));
    await user.upload(input, makePdf("same.pdf"));

    expect(screen.getAllByText("same.pdf")).toHaveLength(1);
  });

  it("removes a file from the list", async () => {
    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("remove-me.pdf"));
    expect(screen.getByText("remove-me.pdf")).toBeInTheDocument();

    await user.click(screen.getByLabelText(/Eliminar/));
    expect(screen.queryByText("remove-me.pdf")).not.toBeInTheDocument();
  });

  it("uploads files and shows success", async () => {
    mockUpload.mockResolvedValue({
      id: "uuid-1",
      nombre_archivo: "eval.pdf",
      hash_sha256: "abc",
      estado: "subido",
      tamano_bytes: 100,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    });

    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("eval.pdf"));
    await user.click(screen.getByText(/Subir 1 archivo/));

    await waitFor(() => {
      expect(screen.getByText("Completado")).toBeInTheDocument();
    });

    expect(mockUpload).toHaveBeenCalledTimes(1);
  });

  it("shows error message on upload failure", async () => {
    const { ApiClientError } = await import("@/features/evaluacion-docente/lib/api/documents");
    mockUpload.mockRejectedValue(
      new ApiClientError(409, "Conflict", { detail: "Archivo ya existe" }),
    );

    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("dup.pdf"));
    await user.click(screen.getByText(/Subir 1 archivo/));

    await waitFor(() => {
      expect(screen.getByText("Archivo ya existe")).toBeInTheDocument();
    });
  });

  it("shows clear completed button after success", async () => {
    mockUpload.mockResolvedValue({
      id: "uuid-1",
      nombre_archivo: "eval.pdf",
      hash_sha256: "abc",
      estado: "subido",
      tamano_bytes: 100,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    });

    const user = userEvent.setup();
    render(<UploadPanel />);

    const input = screen.getByTestId("file-input");
    await user.upload(input, makePdf("eval.pdf"));
    await user.click(screen.getByText(/Subir 1 archivo/));

    await waitFor(() => {
      expect(screen.getByText("Limpiar completados")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Limpiar completados"));
    expect(screen.queryByText("eval.pdf")).not.toBeInTheDocument();
  });
});
