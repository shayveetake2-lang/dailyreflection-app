"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext({ dark: false, toggleDark: () => {} });
export const useDarkMode = () => useContext(DarkModeContext);

export default function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDark(true);
    setMounted(true);
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      localStorage.setItem("darkMode", String(!prev));
      return !prev;
    });
  };

  // Apply or remove the `dark` class on <html> without layout shift
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [dark, mounted]);

  return (
    <DarkModeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}
