"use client";

import { useEffect } from "react";
import { useDB } from "@/lib/store";

/** Reads settings.theme and sets `theme-light` / `theme-dark` class on <html>. */
export default function ThemeApplier() {
  const theme = useDB(s => s.settings.theme);
  useEffect(() => {
    const root = document.documentElement;
    const resolve = () => {
      let next: "dark" | "light";
      if (theme === "system") {
        next = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        next = theme;
      }
      root.classList.remove("theme-light", "theme-dark");
      root.classList.add(next === "light" ? "theme-light" : "theme-dark");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#f5f6f9" : "#08090c");
    };
    resolve();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", resolve);
      return () => mq.removeEventListener("change", resolve);
    }
  }, [theme]);
  return null;
}
