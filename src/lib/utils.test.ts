import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("concatenates same classes", () => {
    const result = cn("foo", "foo");
    expect(result).toBe("foo foo");
  });

  it("handles conditional classes", () => {
    const result = cn("base", true && "active", false && "hidden");
    expect(result).toContain("base");
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles undefined and null", () => {
    const result = cn("foo", undefined, null, "bar");
    expect(result).toBe("foo bar");
  });

  it("handles tailwind merge conflicts", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");
  });
});
