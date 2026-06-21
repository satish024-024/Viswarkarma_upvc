import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import StickyMobileCta from "@/components/public/StickyMobileCta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col pb-16 lg:pb-0">{children}</main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
