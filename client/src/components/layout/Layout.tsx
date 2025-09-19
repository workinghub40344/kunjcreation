import { ReactNode } from "react";
import Navbar from "./Navbar";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  );
};

export default Layout;