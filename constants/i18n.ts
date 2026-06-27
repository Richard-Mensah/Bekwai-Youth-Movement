/**
 * Lightweight, dependency-free bilingual dictionary for the homepage's key
 * strings (header + hero). English is the source of truth across the rest of
 * the site; this gives Bekwai residents a Twi reading of the most prominent
 * copy. Expandable later into a full i18n setup if needed.
 */
export type Lang = "en" | "tw"

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "tw", label: "TW" },
]

export type Dict = Record<string, string>

export const I18N: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.governance": "Our Governance",
    "nav.impact": "Our Impact",
    "nav.media": "Media",
    "nav.contact": "Contact",
    "nav.signIn": "Sign in",
    "nav.join": "Join BYM",
    "hero.eyebrow": "Sefwi Bekwai · Western North Region · Ghana",
    "hero.title": "Harnessing the potential of every young person in Sefwi Bekwai",
    "hero.subtitle":
      "A non-political youth movement building structured governance, community intelligence, and volunteerism across 32 communities — aligned with the UN Sustainable Development Goals.",
    "hero.ctaJoin": "Join the Movement",
    "hero.ctaExplore": "Explore our work",
    "hero.foundingEyebrow": "The road to Founding Day",
  },
  tw: {
    "nav.home": "Fie",
    "nav.about": "Yɛn Ho",
    "nav.governance": "Yɛn Amammuo",
    "nav.impact": "Yɛn Nkɔso",
    "nav.media": "Amanneɛbɔ",
    "nav.contact": "Frɛ Yɛn",
    "nav.signIn": "Bra mu",
    "nav.join": "Bɛka BYM ho",
    "hero.eyebrow": "Sefwi Bekwai · Atɔeɛ Atifi Mantam · Ghana",
    "hero.title": "Yɛreboa mmabunu biara wɔ Sefwi Bekwai ma wɔnya wɔn tumi",
    "hero.subtitle":
      "Mmabunu kuo a ɛnni amanyɔ mu, a ɛreyɛ amammuo, mpɔtam nimdeɛ, ne adɔeyɛ wɔ mpɔtam 32 mu — a ɛne UN Nkɔsoɔ Botaeɛ hyia.",
    "hero.ctaJoin": "Bɛka Kuo no ho",
    "hero.ctaExplore": "Hwɛ yɛn adwuma",
    "hero.foundingEyebrow": "Ɛkwan a ɛkɔ Nnyinasoɛ Da no",
  },
}

/** Maps the English nav labels used in PUBLIC_NAV to dictionary keys. */
export const NAV_LABEL_KEYS: Record<string, string> = {
  Home: "nav.home",
  About: "nav.about",
  "Our Governance": "nav.governance",
  "Our Impact": "nav.impact",
  Media: "nav.media",
  Contact: "nav.contact",
}
