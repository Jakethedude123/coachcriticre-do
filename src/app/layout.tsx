import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navbar from "@/app/components/Navbar";
import BugReportButton from "@/components/BugReportButton";
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
      <body className={inter.className + " bg-white dark:bg-gradient-to-b dark:from-[#0A0D12] dark:to-[#181d23]"}>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-transparent overflow-x-hidden">
            <Navbar />
            {children}
            <BugReportButton />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
