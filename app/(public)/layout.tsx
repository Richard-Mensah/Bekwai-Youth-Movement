import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import LanguageProvider from "@/components/i18n/LanguageProvider"
import WhatsAppFab from "@/components/features/public/WhatsAppFab"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
    </LanguageProvider>
  )
}
