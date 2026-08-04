import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tokensFile = readFileSync(resolve(process.cwd(), "app/design-tokens.css"), "utf8");
const tokens = Object.fromEntries(
  [...tokensFile.matchAll(/--([\w-]+):\s*(#[0-9A-F]{6})/g)].map(([, name, value]) => [name, value]),
);

function luminance(hex: string) {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function ratio(foreground: string, background: string) {
  const foregroundValue = tokens[foreground];
  const backgroundValue = tokens[background];
  if (!foregroundValue || !backgroundValue) throw new Error(`Missing token pair: ${foreground}/${background}`);

  return contrast(foregroundValue, backgroundValue);
}

describe("design token accessibility", () => {
  it("keeps primary and secondary text at AAA contrast on core surfaces", () => {
    expect(ratio("text-primary", "canvas")).toBeGreaterThanOrEqual(7);
    expect(ratio("text-primary", "surface")).toBeGreaterThanOrEqual(7);
    expect(ratio("text-secondary", "canvas")).toBeGreaterThanOrEqual(7);
    expect(ratio("text-secondary", "surface-raised")).toBeGreaterThanOrEqual(7);
  });

  it("keeps interactive and status tokens distinguishable", () => {
    expect(ratio("text-inverse", "action-primary")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("text-primary", "accent-amber")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("border-control", "surface")).toBeGreaterThanOrEqual(3);
    expect(ratio("focus", "surface")).toBeGreaterThanOrEqual(3);
    expect(ratio("status-error", "status-error-surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("status-warning", "status-warning-surface")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("status-success", "status-success-surface")).toBeGreaterThanOrEqual(4.5);
  });
});
