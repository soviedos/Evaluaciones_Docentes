import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("root redirects to /inicio", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/inicio");
  });

  test("displays the Inicio page with heading", async ({ page }) => {
    await page.goto("/inicio");
    await expect(page.getByRole("heading", { name: "Inicio" })).toBeVisible();
  });

  test("sidebar navigation works for all sections", async ({ page }) => {
    await page.goto("/inicio");

    const routes = [
      { label: "Carga de PDFs", url: "/carga", heading: "Cargar PDFs" },
      { label: "Biblioteca", url: "/biblioteca", heading: "Biblioteca" },
      { label: "Docentes", url: "/docentes", heading: "Docentes" },
      { label: "Reportes", url: "/reportes", heading: "Reportes" },
    ];

    for (const route of routes) {
      await page.getByRole("link", { name: route.label }).first().click();
      await expect(page).toHaveURL(route.url);
      await expect(
        page.getByRole("heading", { name: route.heading, exact: true }),
      ).toBeVisible();
    }
  });

  test("page has correct document title", async ({ page }) => {
    await page.goto("/carga");
    await expect(page).toHaveTitle(/Cargar PDFs/);
  });
});
