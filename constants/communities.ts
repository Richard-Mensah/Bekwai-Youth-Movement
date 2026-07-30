import type { Community } from "@/types"

/**
 * The 33 communities = Sefwi Bekwai (town) + 32 sub-communities.
 *
 * Sefwi Bekwai is the capital of the Sefwi Bekwai Traditional Area within the
 * Bibiani-Anhwiaso-Bekwai Municipal, Western North Region, Ghana.
 *
 * These are BYM's real communities. Migration 0022 syncs the database to this
 * list, so the two must be kept in step: adding a name here without a matching
 * migration leaves the site and the database disagreeing, which is exactly how
 * members ended up recorded against the wrong community once already.
 *
 * ORDER IS SIGNIFICANT. Each community's id is its position in this array, and
 * those ids are foreign keys on profiles and cin_reports — reordering the array
 * silently repoints every existing record at a different community. Append new
 * names to the end; never re-sort. For display order use COMMUNITIES_BY_NAME.
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

/**
 * 33 — and the site's copy saying "32 sub-communities" is also correct, because
 * the 33rd entry is Sefwi Bekwai town itself (`isTown: true`), which is not a
 * *sub*-community. Both numbers are right about different things.
 *
 * Written down because the mismatch looks exactly like a bug: the database has 33
 * rows, the metadata says 32, and the obvious "fix" is to make one match the
 * other. Don't. Use COMMUNITY_COUNT where you mean "places to pick from" (the
 * join form's dropdown) and the literal 32 where you mean "sub-communities the
 * movement represents".
 */
export const COMMUNITY_COUNT = COMMUNITIES.length // 33 = 32 sub-communities + the town

/**
 * Compares community names the way a reader expects, so "Adobewura No.2"
 * follows "Adobewura No.1" rather than sorting by digit as text.
 */
export function compareCommunityNames(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" })
}

/** Alphabetical view for anywhere communities are listed or chosen from. */
export const COMMUNITIES_BY_NAME: Community[] = [...COMMUNITIES].sort((a, b) =>
  compareCommunityNames(a.name, b.name)
)
