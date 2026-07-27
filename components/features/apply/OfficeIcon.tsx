import {
  Crown,
  ShieldCheck,
  Network,
  ScrollText,
  Laptop,
  Wallet,
  ReceiptText,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Leaf,
  Megaphone,
  Lock,
  Handshake,
  UsersRound,
  Landmark,
  CalendarDays,
  Map,
  Users,
  Gavel,
  Mic,
  Scale,
  ClipboardList,
  Radar,
  Database,
  Armchair,
  type LucideIcon,
} from "lucide-react"
import type { OfficeIcon as OfficeIconKey, RoleArm } from "@/constants/offices"

const ICONS: Record<OfficeIconKey, LucideIcon> = {
  crown: Crown,
  shield: ShieldCheck,
  network: Network,
  scroll: ScrollText,
  laptop: Laptop,
  wallet: Wallet,
  receipt: ReceiptText,
  graduation: GraduationCap,
  heart: HeartPulse,
  briefcase: Briefcase,
  leaf: Leaf,
  megaphone: Megaphone,
  lock: Lock,
  handshake: Handshake,
  venus: UsersRound,
  landmark: Landmark,
  calendar: CalendarDays,
  map: Map,
  users: Users,
  gavel: Gavel,
  mic: Mic,
  scale: Scale,
  clipboard: ClipboardList,
  radar: Radar,
  database: Database,
  seat: Armchair,
}

export function officeIcon(key: OfficeIconKey): LucideIcon {
  return ICONS[key] ?? Users
}

/** Per-arm accent, used consistently on cards, chips and the catalogue rail. */
export const ARM_STYLE: Record<
  RoleArm,
  { chip: string; edge: string; dot: string; tint: string }
> = {
  cabinet: {
    chip: "bg-canopy-50 text-canopy-700 ring-canopy-100 dark:bg-canopy-700/40 dark:text-canopy-50 dark:ring-white/10",
    edge: "before:bg-canopy",
    dot: "bg-canopy",
    tint: "bg-canopy-50 text-canopy dark:bg-canopy-700/50 dark:text-gold-200",
  },
  parliament: {
    chip: "bg-gold-50 text-gold-700 ring-gold-200 dark:bg-gold-400/15 dark:text-gold-200 dark:ring-gold-400/25",
    edge: "before:bg-gold-400",
    dot: "bg-gold-500",
    tint: "bg-gold-50 text-gold-700 dark:bg-gold-400/15 dark:text-gold-200",
  },
  cin: {
    chip: "bg-brand-blue-50 text-brand-blue-700 ring-brand-blue-100 dark:bg-brand-blue/20 dark:text-brand-blue-100 dark:ring-white/10",
    edge: "before:bg-brand-blue",
    dot: "bg-brand-blue",
    tint: "bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue/20 dark:text-brand-blue-100",
  },
  community: {
    chip: "bg-brand-green-50 text-brand-green-700 ring-brand-green-100 dark:bg-brand-green/20 dark:text-brand-green-100 dark:ring-white/10",
    edge: "before:bg-brand-green",
    dot: "bg-brand-green",
    tint: "bg-brand-green-50 text-brand-green-700 dark:bg-brand-green/20 dark:text-brand-green-100",
  },
}
