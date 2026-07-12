"use server";

import { PrismaClient } from "@prisma/client";
import { Plant, PlantGroup } from "@/types";
import { PLANT_GROUPS } from "@/data/plants"; // We can keep groups in memory or move to DB, let's keep groups from data/plants for now since they are static.

const prisma = new PrismaClient();

export async function getPlants(): Promise<Plant[]> {
  const plants = await prisma.plant.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return plants.map((p) => ({
    slug: p.slug as any,
    name: p.name,
    shortName: p.shortName,
    group: p.group as any,
    kind: p.kind as any,
    description: p.description,
  }));
}

export async function getPlantBySlug(slug: string): Promise<Plant | null> {
  const p = await prisma.plant.findUnique({
    where: { slug },
  });

  if (!p) return null;

  return {
    slug: p.slug as any,
    name: p.name,
    shortName: p.shortName,
    group: p.group as any,
    kind: p.kind as any,
    description: p.description,
  };
}

export async function getGroups(): Promise<PlantGroup[]> {
  return PLANT_GROUPS; // Returning static groups for now.
}
