"use client";

/**
 * The page's light. The accent tints the fixed #atmosphere layer; the base
 * colour sits on <html>. Clearing only removes a value if it is still the one
 * the caller set, because the next page may already have applied its own.
 */

const layer = () => document.getElementById("atmosphere");

export function setAccent(value: string) {
  layer()?.style.setProperty("--accent", value);
}

export function clearAccent(ifValue: string | null) {
  const el = layer();
  if (el && ifValue && el.style.getPropertyValue("--accent") === ifValue) {
    el.style.removeProperty("--accent");
  }
}

export function setBase(value: string) {
  document.documentElement.style.setProperty("--base", value);
}

export function clearBase(ifValue: string) {
  const root = document.documentElement.style;
  if (root.getPropertyValue("--base") === ifValue) root.removeProperty("--base");
}
