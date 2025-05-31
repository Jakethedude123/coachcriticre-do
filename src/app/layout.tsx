import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navbar from "@/app/components/Navbar";
import SiteGate from "@/app/components/SiteGate";
import { FC } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CoachCritic - Find Your Perfect Fitness Coach",
  description: "Find the best bodybuilding and powerlifting coaches near you",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <SiteGate>
              <Navbar />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </SiteGate>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
