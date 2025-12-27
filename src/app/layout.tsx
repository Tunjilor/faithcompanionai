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
      <body className="min-h-screen bg-fc text-fc-foreground">
        {/* Subtle global background */}
        <div className="fc-bg" />

        <Navbar />

        {/* Consistent page container */}
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
