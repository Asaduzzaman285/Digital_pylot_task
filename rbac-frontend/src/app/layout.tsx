import type { Metadata } from "next";
import AuthProvider from "@/components/layout/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Obliq RBAC",
  description: "Enterprise Role-Based Access Control System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
