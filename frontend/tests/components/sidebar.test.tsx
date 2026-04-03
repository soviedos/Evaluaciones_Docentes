import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "@/components/layout/sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/inicio",
}));

describe("Sidebar", () => {
  const defaultProps = { collapsed: false, onToggle: vi.fn() };

  it("renders the brand name", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Evaluaciones")).toBeInTheDocument();
  });

  it("renders all 8 navigation items", () => {
    render(<Sidebar {...defaultProps} />);

    const expectedLabels = [
      "Inicio",
      "Carga de PDFs",
      "Biblioteca",
      "Docentes",
      "Estadístico",
      "Sentimiento",
      "Consultas IA",
      "Reportes",
    ];

    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders group titles", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Principal")).toBeInTheDocument();
    expect(screen.getByText("Análisis")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    render(<Sidebar {...defaultProps} />);
    const activeLink = screen.getByText("Inicio").closest("a");
    expect(activeLink).toHaveAttribute("href", "/inicio");
    // Active link should have the accent background class
    expect(activeLink?.className).toContain("bg-sidebar-accent");
  });

  it("hides labels when collapsed", () => {
    render(<Sidebar {...{ ...defaultProps, collapsed: true }} />);
    expect(screen.queryByText("Evaluaciones")).not.toBeInTheDocument();
    expect(screen.queryByText("Inicio")).not.toBeInTheDocument();
  });

  it("calls onToggle when collapse button is clicked", async () => {
    const onToggle = vi.fn();
    render(<Sidebar collapsed={false} onToggle={onToggle} />);

    const collapseButton = screen.getByText("Colapsar").closest("button");
    expect(collapseButton).toBeInTheDocument();

    await userEvent.click(collapseButton!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
