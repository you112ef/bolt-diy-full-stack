import type { Metadata } from "next";
import "./globals.css"; // Ensure globals.css is imported here too

export const metadata: Metadata = {
  title: "Mobile Flow App",
  description: "Displaying Mobile Flow UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
