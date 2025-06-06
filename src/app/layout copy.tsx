import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ANAYASS - Tableau de bord',
  description: 'Tableau de bord pour la gestion des boîtes de construction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
