import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropZone } from "@/components/upload/drop-zone";

describe("DropZone", () => {
  it("renders instructions text", () => {
    render(<DropZone onFilesSelected={vi.fn()} />);

    expect(
      screen.getByText(/Arrastra archivos PDF/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Solo archivos PDF/),
    ).toBeInTheDocument();
  });

  it("opens file picker on click", async () => {
    const user = userEvent.setup();
    render(<DropZone onFilesSelected={vi.fn()} />);

    const dropzone = screen.getByRole("button", {
      name: /Zona de carga/,
    });
    await user.click(dropzone);

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    expect(input.type).toBe("file");
    expect(input.accept).toContain(".pdf");
    expect(input.multiple).toBe(true);
  });

  it("calls onFilesSelected with valid PDFs", async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();
    render(<DropZone onFilesSelected={onFilesSelected} />);

    const input = screen.getByTestId("file-input");
    const pdfFile = new File(["pdf-content"], "test.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, pdfFile);

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected).toHaveBeenCalledWith([pdfFile]);
  });

  it("rejects non-PDF files", async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();
    render(<DropZone onFilesSelected={onFilesSelected} />);

    const input = screen.getByTestId("file-input");
    const txtFile = new File(["content"], "notes.txt", {
      type: "text/plain",
    });

    await user.upload(input, txtFile);

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("rejects empty files", async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();
    render(<DropZone onFilesSelected={onFilesSelected} />);

    const input = screen.getByTestId("file-input");
    const emptyFile = new File([], "empty.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, emptyFile);

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("accepts multiple PDF files at once", async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();
    render(<DropZone onFilesSelected={onFilesSelected} />);

    const input = screen.getByTestId("file-input");
    const file1 = new File(["content1"], "eval1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File(["content2"], "eval2.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, [file1, file2]);

    expect(onFilesSelected).toHaveBeenCalledWith([file1, file2]);
  });

  it("is disabled when disabled prop is true", () => {
    render(<DropZone onFilesSelected={vi.fn()} disabled />);

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
