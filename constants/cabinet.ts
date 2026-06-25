import type { CabinetPosition } from "@/types"

/**
 * The 19-member YGA Cabinet (Governance Doc §2.2), top-down from the
 * Director-General. `reportsTo` encodes the precedence used by the org chart.
 * "President" is a display alias of the DG only.
 */
export const CABINET_POSITIONS: CabinetPosition[] = [
  {
    no: 1,
    title: "Director-General (DG)",
    ukEquivalent: "Prime Minister",
    reportsTo: "BYM Founding Leadership",
    sdg: [16, 17],
  },
  {
    no: 2,
    title: "1st Deputy Director-General",
    ukEquivalent: "Deputy PM",
    reportsTo: "Director-General (DG)",
    sdg: [16],
  },
  {
    no: 3,
    title: "2nd Deputy Director-General",
    ukEquivalent: "Deputy PM",
    reportsTo: "Director-General (DG)",
    sdg: [17],
  },
  {
    no: 4,
    title: "Secretary-General",
    ukEquivalent: "Cabinet Secretary / Chief of Staff",
    reportsTo: "Director-General (DG)",
    sdg: [16],
  },
  {
    no: 5,
    title: "Deputy Secretary-General",
    ukEquivalent: "Deputy Civic/Town Secretary",
    reportsTo: "Secretary-General",
    sdg: [17],
  },
  {
    no: 6,
    title: "Chief Financial Officer",
    ukEquivalent: "Chancellor of the Exchequer",
    reportsTo: "Director-General (DG)",
    sdg: [17],
  },
  {
    no: 7,
    title: "Deputy Financial Secretary",
    ukEquivalent: "Treasury Board",
    reportsTo: "Chief Financial Officer",
    sdg: [17],
  },
  {
    no: 8,
    title: "Secretary for Education & Youth",
    ukEquivalent: "Secretary of State for Education",
    reportsTo: "1st Deputy Director-General",
    sdg: [4, 8],
  },
  {
    no: 9,
    title: "Secretary for Health & Welfare",
    ukEquivalent: "Secretary for Health",
    reportsTo: "1st Deputy Director-General",
    sdg: [3, 5],
  },
  {
    no: 10,
    title: "Secretary for Economic Affairs",
    ukEquivalent: "Secretary for Work & Enterprise",
    reportsTo: "1st Deputy Director-General",
    sdg: [1, 8, 10],
  },
  {
    no: 11,
    title: "Secretary for Environment",
    ukEquivalent: "Secretary for Environment",
    reportsTo: "1st Deputy Director-General",
    sdg: [6, 11, 13, 15],
  },
  {
    no: 12,
    title: "Secretary for Communications",
    ukEquivalent: "Secretary for Digital, Culture & Media",
    reportsTo: "1st Deputy Director-General",
    sdg: [17],
  },
  {
    no: 13,
    title: "Home Secretary",
    ukEquivalent: "Secretary for the Interior",
    reportsTo: "1st Deputy Director-General",
    sdg: [16],
  },
  {
    no: 14,
    title: "Secretary for Regional Affairs & Partnerships",
    ukEquivalent: "Regional Secretary",
    reportsTo: "1st Deputy Director-General",
    sdg: [17],
  },
  {
    no: 15,
    title: "Secretary for Women & Gender Equality",
    ukEquivalent: "Director for Women & Equalities",
    reportsTo: "1st Deputy Director-General",
    sdg: [5, 10],
  },
  {
    no: 16,
    title: "Secretary for Youth Parliament Affairs",
    ukEquivalent: "Leader of the House",
    reportsTo: "1st Deputy Director-General",
    sdg: [16],
  },
  {
    no: 17,
    title: "Civic Organiser",
    ukEquivalent: "Chief Whip",
    reportsTo: "1st Deputy Director-General",
    sdg: [11, 17],
  },
  {
    no: 18,
    title: "Deputy Organiser",
    ukEquivalent: "Deputy Chief Whip",
    reportsTo: "Civic Organiser",
    sdg: [17],
  },
  {
    no: 19,
    title: "Inter-Community Liaison Officer",
    ukEquivalent: "Civil Lead",
    reportsTo: "Home Secretary",
    sdg: [10, 16],
  },
]
