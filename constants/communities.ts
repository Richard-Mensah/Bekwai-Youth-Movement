import type { Community } from "@/types"

/**
 * The 32 communities = Sefwi Bekwai (town) + 31 sub-communities.
 *
 * Sefwi Bekwai is the capital of the Sefwi Bekwai Traditional Area within the
 * Bibiani-Anhwiaso-Bekwai Municipal, Western North Region, Ghana.
 *
 * NAMES BELOW ARE EDITABLE PLACEHOLDERS. A few are confirmed real area towns
 * (Awaso, Anhwiaso, Chirano, Kunkumso, Aprutu, Sayerano, Adabokrom); the rest
 * are realistic local-style names to replace with BYM's official community list.
 * IDs and counts are fixed — only edit the `name` values.
 */
const SUB_COMMUNITY_NAMES = [
  "Awaso", "Anhwiaso", "Chirano", "Kunkumso", "Aprutu", "Sayerano",
  "Adabokrom", "Dominase", "Subriso", "Kojina", "Pataboso", "Ahokwaa",
  "Nkatieso", "Bekwai Nkwanta", "Nyamebekyere", "Datano", "Kwakukrom",
  "Adjoafua", "Asempaneye", "Bopa", "Camp", "Old Town", "New Town",
  "Zongo", "Krofofrom", "Mile Eight", "Akoti", "Brapakrom", "Yawkrom",
  "Asanteman", "Wreckers",
]

export const COMMUNITIES: Community[] = [
  { id: 1, name: "Sefwi Bekwai", isTown: true },
  ...SUB_COMMUNITY_NAMES.map((name, i) => ({
    id: i + 2,
    name,
    isTown: false,
  })),
]

export const COMMUNITY_COUNT = COMMUNITIES.length // 32
