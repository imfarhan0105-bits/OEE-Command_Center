import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import TopNav from "@/components/nav/TopNav";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "OEE Command Center",
  description: "Industrial OEE monitoring digital twin for precision manufacturing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <SmoothScrollProvider>
            <TopNav />
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
