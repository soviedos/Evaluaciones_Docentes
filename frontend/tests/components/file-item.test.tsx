import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileItem, type FileItemData } from "@/components/upload/file-item";

function makeItem(overrides: Partial<FileItemData> = {}): FileItemData {
  return {
    id: "file-1",
    file: new File(["content"], "evaluacion.pdf", { type: "application/pdf" }),
    status: "pending",
    ...overrides,
  };
}

describe("FileItem", () => {
  it("shows file name and size", () => {
    render(<FileItem item={makeItem()} onRemove={vi.fn()} />);

    expect(screen.getByText("evaluacion.pdf")).toBeInTheDocument();
    expect(screen.getByText(/B|KB|MB/)).toBeInTheDocument();
  });

  it("shows pending status", () => {
    render(<FileItem item={makeItem({ status: "pending" })} onRemove={vi.fn()} />);

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("shows uploading status", () => {
    render(<FileItem item={makeItem({ status: "uploading" })} onRemove={vi.fn()} />);

    expect(screen.getByText("Subiendo...")).toBeInTheDocument();
  });

  it("shows success status", () => {
    render(<FileItem item={makeItem({ status: "success" })} onRemove={vi.fn()} />);

    expect(screen.getByText("Completado")).toBeInTheDocument();
  });

  it("shows error status with message", () => {
    render(
      <FileItem
        item={makeItem({ status: "error", error: "Archivo duplicado" })}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Archivo duplicado")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(<FileItem item={makeItem()} onRemove={onRemove} />);

    await user.click(screen.getByLabelText(/Eliminar/));

    expect(onRemove).toHaveBeenCalledWith("file-1");
  });

  it("does not show remove button while uploading", () => {
    render(
      <FileItem item={makeItem({ status: "uploading" })} onRemove={vi.fn()} />,
    );

    expect(screen.queryByLabelText(/Eliminar/)).not.toBeInTheDocument();
  });
});
