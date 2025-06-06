import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ANAYASS - Tableau de bord",
  description: "Tableau de bord pour la gestion des boîtes de construction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" style={{ height: "100%" }} className="h-full">
      <body
        className={inter.className}
        style={{
          height: "100%",
          margin: 0,
          fontFamily: "inherit",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{ display: "flex", minHeight: "100vh" }}
          className="flex min-h-screen"
        >
          <Sidebar />
          <main
            style={{ flex: 1, padding: "1.5rem", backgroundColor: "#f9fafb" }}
            className="flex-1 p-6 bg-gray-50"
          >
            <div
              style={{ maxWidth: "80rem", margin: "0 auto" }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
