import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Faith Companion AI",
  description: "Daily verse • prayer • hope",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-fc text-fc-foreground">
  <div className="fc-bg" />
  {children}
</body>

    </html>
  );
}
