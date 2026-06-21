import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/public/AuthModal";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import StickyMobileCta from "@/components/public/StickyMobileCta";
import AdminFloatingButton from "@/components/public/AdminFloatingButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <StickyMobileCta />
        <AuthModal />
        <AdminFloatingButton />
      </div>
    </AuthProvider>
  );
}
