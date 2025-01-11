import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mecoc 2025 QR Scanner",
  description:
    "Mecoc 2025 QR Scanner allows you to verify visitor access using unique QR codes.",
  keywords: [
    "Mecoc 2025",
    "QR Scanner",
    "Visitor Access",
    "Event Management",
    "Barcode Scanner",
  ],
  openGraph: {
    title: "Mecoc 2025 QR Scanner",
    description:
      "Verify visitor access with Mecoc 2025 QR Scanner. Ensure secure and efficient event management.",
    url: "https://your-app-domain.com",
    type: "website",
    images: [
      {
        url: "/mecoc-logo.png",
        alt: "Mecoc 2025 QR Scanner Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mecoc 2025 QR Scanner",
    description:
      "Ensure secure and efficient event management with Mecoc 2025 QR Scanner.",
    images: ["/mecoc-logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
