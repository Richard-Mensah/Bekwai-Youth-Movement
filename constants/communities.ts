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
  "Humjibre", "Kojina", "Apenkrom", "Nyitina", "Adobewura No.1", "Adobewura No.2",
  "Akaasu", "Kofikrom", "Ashiam", "Naama/Clinic Top", "Bekwai Township", "Zongo",
  "Surano", "Donkorkrom", "Dansokrom", "Bankromisa", "Market Square",
  "Post Office/Ayiam", "Sukusukuu", "Lowcost/Axle Weight", "Chira", "Bakromisa", "Sonkoli",
  "Atwima", "Muoho", "Bakokrom", "Atronsu", "Ampez", "Achimota",
  "Peaceland", "Pimtibikrom", "Difo Nkansah Area",
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
