"use server";

import { Plant, PlantGroup } from "@/types";
import { PLANT_GROUPS, PLANTS } from "@/data/plants";

export async function getPlants(): Promise<Plant[]> {
  // Sort alphabetically by name to match old Prisma behavior
  return [...PLANTS].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlantBySlug(slug: string): Promise<Plant | null> {
  const p = PLANTS.find(plant => plant.slug === slug);
  if (!p) return null;
  return p;
}

export async function getGroups(): Promise<PlantGroup[]> {
  return PLANT_GROUPS;
}
