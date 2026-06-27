import { MessageCircle } from "lucide-react"
import { getSettings } from "@/lib/data/content"

/** Floating WhatsApp community button. Hidden until a number/link is set in
 * CMS → Site settings. A raw phone number becomes a wa.me link; a full URL
 * (e.g. a chat.whatsapp.com community invite) is used as-is. */
export default async function WhatsAppFab() {
  const { whatsapp } = await getSettings()
  const value = (whatsapp ?? "").trim()
  if (!value) return null

  const href = value.startsWith("http")
    ? value
    : `https://wa.me/${value.replace(/[^0-9]/g, "")}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}
