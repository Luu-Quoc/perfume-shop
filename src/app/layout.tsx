import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 min-w-0 w-full">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
