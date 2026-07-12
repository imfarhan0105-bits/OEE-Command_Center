import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLANTS, getPlant } from "@/data/plants";
import PlantDashboardClient from "@/components/plant/PlantDashboardClient";

export function generateStaticParams() {
  return PLANTS.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const plant = getPlant(slug);
  return { title: plant ? `${plant.name} — OEE Command Center` : "Plant Not Found" };
}

export default async function PlantPage({ params }: { params: Params }) {
  const { slug } = await params;
  const plant = getPlant(slug);
  if (!plant) notFound();
  return <PlantDashboardClient plant={plant} />;
}
