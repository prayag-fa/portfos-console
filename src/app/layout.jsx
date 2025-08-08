import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { AppProvider } from "@/lib/context/AppContext";
import NotificationSystem from "@/components/ui/NotificationSystem";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfos Console",
  description: "Self Help Portal Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <ThemeProvider>
            <div className="flex h-screen bg-gray-50">
               {/* Sidebar */}
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                  {children}
                </main>
              </div>
            </div>
            <NotificationSystem />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
} 