import { Plant, PlantGroup, PlantSlug } from "@/types";
import { PLANT_GROUPS, PLANTS } from "@/data/plants";

export async function listPlants(): Promise<Plant[]> {
  return PLANTS;
}

export async function listGroups(): Promise<PlantGroup[]> {
  return PLANT_GROUPS;
}

export async function getPlantsInGroup(groupSlug: string): Promise<Plant[]> {
  return PLANTS.filter(p => p.group === groupSlug);
}