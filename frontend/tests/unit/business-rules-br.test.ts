/**
 * Business-rules edge-case tests [BR-*] — fills gaps from test plan.
 *
 * Period validation, modalidad inference, and chronological sorting
 * are now handled exclusively by the backend. These tests focus on
 * remaining frontend-only logic: severidad ordering and modalidad type guard.
 */

import { describe, expect, it } from "vitest";
import { compareSeveridad, isModalidad } from "@/lib/business-rules";

// ════════════════════════════════════════════════════════════════
//  1. compareSeveridad stability
// ════════════════════════════════════════════════════════════════

describe("compareSeveridad — stability & edge cases", () => {
  it("equal values produce 0", () => {
    expect(compareSeveridad("alta", "alta")).toBe(0);
    expect(compareSeveridad("media", "media")).toBe(0);
    expect(compareSeveridad("baja", "baja")).toBe(0);
  });

  it("sort is stable for equal-severity items", () => {
    type Item = { name: string; sev: "alta" | "media" | "baja" };
    const items: Item[] = [
      { name: "A", sev: "alta" },
      { name: "B", sev: "alta" },
      { name: "C", sev: "alta" },
    ];
    const sorted = [...items].sort((a, b) => compareSeveridad(a.sev, b.sev));
    expect(sorted.map((i) => i.name)).toEqual(["A", "B", "C"]);
  });
});

// ════════════════════════════════════════════════════════════════
//  2. isModalidad rejects DESCONOCIDA strings
// ════════════════════════════════════════════════════════════════

describe("isModalidad strictness", () => {
  it.each(["DESCONOCIDA", "desconocida", "cuatrimestral", "mensual", "b2b"])(
    "rejects '%s' (wrong case or desconocida)",
    (v) => {
      expect(isModalidad(v)).toBe(false);
    },
  );
});
