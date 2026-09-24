import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";
import { TransitionManager } from "@/components/transitions/TransitionManager";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ProjecSona | Loja Digital & Comparador de Preços Persona",
  description:
    "Compre chaves digitais autênticas de Persona 3 Reload, Persona 4 Revival e Persona 5 Royal com entrega imediata e compare preços entre as principais lojas autorizadas.",
  keywords: [
    "Persona 3 Reload",
    "Persona 4 Revival",
    "Persona 5 Royal",
    "Steam Keys",
    "Chaves Digitais",
    "Comparador de Preços Games",
    "JRPG",
  ],
  authors: [{ name: "ProjecSona Team" }],
  openGraph: {
    title: "ProjecSona - Loja Digital & Comparador Persona",
    description: "Chaves Steam oficiais, entrega instantânea e comparador de ofertas Persona.",
    siteName: "ProjecSona Marketplace",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased selection:bg-theme-primary selection:text-black">
        <AuthProvider>
          <CartProvider>
            <ThemeProvider>
              <TransitionManager>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
              </TransitionManager>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
