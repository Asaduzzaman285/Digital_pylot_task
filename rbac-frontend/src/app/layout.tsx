import type { Metadata } from "next";
import AuthProvider from "@/components/layout/auth-provider";
import { Toaster } from "react-hot-toast";
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
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#1A1A1A',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontWeight: 500,
              },
              success: {
                iconTheme: {
                  primary: '#E84B1C',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
