import type { Community } from "@/types"

/**
 * The 32 communities = Sefwi Bekwai (town) + 31 sub-communities.
 *
 * IMPORTANT: The governance documents reference "32 communities" and one
 * example name ("Amoaful") but do not enumerate the full list. The 31
 * sub-community names below are PLACEHOLDERS — replace each with the real
 * BYM community name. The structure, IDs, and counts are correct.
 */
export const COMMUNITIES: Community[] = [
  { id: 1, name: "Sefwi Bekwai", isTown: true },
  ...Array.from({ length: 31 }, (_, i) => ({
    id: i + 2,
    name: `Sub-Community ${String(i + 1).padStart(2, "0")}`,
    isTown: false,
  })),
]

export const COMMUNITY_COUNT = COMMUNITIES.length // 32
