import { Plant, PlantGroup } from "@/types";

export const PLANT_GROUPS: PlantGroup[] = [
  {
    slug: "sector-25",
    name: "SECTOR 25",
    fullName: "Sector 25 Manufacturing Group",
    plantSlugs: ["sector-25-forging", "sector-25-cnc", "sector-25-vmc"],
  },
  {
    slug: "sector-69",
    name: "SECTOR 69 IMT",
    fullName: "Sector 69 IMT Manufacturing Group",
    plantSlugs: ["sector-69-block-b", "sector-69-block-c", "sector-69-block-d"],
  },
];

export const PLANTS: Plant[] = [
  {
    slug: "sector-25-forging",
    name: "SECTOR 25 FORGING",
    shortName: "FORGING",
    group: "sector-25",
    kind: "forging",
    description: "Heavy forging press hall producing high-tolerance steel components under extreme pressure and heat.",
  },
  {
    slug: "sector-25-cnc",
    name: "SECTOR 25 CNC",
    shortName: "CNC",
    group: "sector-25",
    kind: "cnc",
    description: "High-speed CNC turning cells delivering precision cylindrical components at scale.",
  },
  {
    slug: "sector-25-vmc",
    name: "SECTOR 25 VMC",
    shortName: "VMC",
    group: "sector-25",
    kind: "vmc",
    description: "Vertical machining centres executing complex multi-axis precision geometries.",
  },
  {
    slug: "sector-69-block-b",
    name: "SECTOR 69 IMT BLOCK B",
    shortName: "BLOCK B",
    group: "sector-69",
    kind: "cnc",
    description: "Block B integrated manufacturing environment spanning multiple production disciplines.",
  },
  {
    slug: "sector-69-block-c",
    name: "SECTOR 69 IMT BLOCK C",
    shortName: "BLOCK C",
    group: "sector-69",
    kind: "vmc",
    description: "Block C integrated manufacturing environment optimized for high-volume component processing.",
  },
  {
    slug: "sector-69-block-d",
    name: "SECTOR 69 IMT BLOCK D",
    shortName: "BLOCK D",
    group: "sector-69",
    kind: "forging",
    description: "Block D specialized production and assembly line for finished assemblies.",
  },
  {
    slug: "sector-58",
    name: "SECTOR 58",
    shortName: "SECTOR 58",
    group: "none",
    kind: "cnc",
    description: "High-throughput industrial production line optimized for continuous output.",
  },
  {
    slug: "unit-94",
    name: "UNIT 94",
    shortName: "UNIT 94",
    group: "none",
    kind: "vmc",
    description: "Precision manufacturing cell dedicated to tight-tolerance component families.",
  },
  {
    slug: "unit-97",
    name: "UNIT 97",
    shortName: "UNIT 97",
    group: "none",
    kind: "forging",
    description: "Mechanical production environment supporting assembly-adjacent operations.",
  },
];

export function getPlant(slug: string): Plant | undefined {
  return PLANTS.find((p) => p.slug === slug);
}

export function getGroup(slug: string): PlantGroup | undefined {
  return PLANT_GROUPS.find((g) => g.slug === slug);
}

export function getPlantsInGroup(groupSlug: string): Plant[] {
  return PLANTS.filter((p) => p.group === groupSlug);
}
