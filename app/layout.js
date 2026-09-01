import "./globals.css";
import DarkModeProvider from "./DarkModeProvider";

export const metadata = {
  title: "Daily Reflection",
  description: "Track your daily thoughts and feelings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}
