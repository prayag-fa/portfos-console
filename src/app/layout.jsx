import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AppProvider } from "@/lib/context/AppContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfos Console",
  description: "Self Help Portal Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 