import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navbar from "@/app/components/Navbar";
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
      <body className={inter.className + " bg-gray-50 dark:bg-black"}>
        <AuthProvider>
          <div className="min-h-screen">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
