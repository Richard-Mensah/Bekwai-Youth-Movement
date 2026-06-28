import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import LanguageProvider from "@/components/i18n/LanguageProvider"
import ThemeProvider from "@/components/theme/ThemeProvider"
import CommandPaletteProvider from "@/components/features/public/CommandPalette"
import WhatsAppFab from "@/components/features/public/WhatsAppFab"
import FloatingActions from "@/components/features/public/FloatingActions"
import ScrollProgress from "@/components/features/public/ScrollProgress"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CommandPaletteProvider>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
          <FloatingActions />
        </CommandPaletteProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
