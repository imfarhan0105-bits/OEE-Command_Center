import HeroScrollExperience from "@/components/sections/HeroScrollExperience";
import GroupOEESection from "@/components/sections/GroupOEESection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import PlantsGridSection from "@/components/sections/PlantsGridSection";
import { getHomePageData } from "@/services/oeeService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { companyOee, oeeMonthLabel, sector25Trend, sector69Trend, allPlantsLatest } =
    await getHomePageData();

  return (
    <main id="overview" className="bg-[var(--industrial-bg)] text-[var(--steel-light)]">
      <HeroScrollExperience companyOee={companyOee} oeeMonthLabel={oeeMonthLabel} />
      <GroupOEESection id="sector-25" groupSlug="sector-25" groupName="SECTOR 25" accent="var(--accent-good)" serverTrend={sector25Trend} />
      <GroupOEESection id="sector-69" groupSlug="sector-69" groupName="SECTOR 69" accent="var(--accent-cyan)" serverTrend={sector69Trend} />
      <ComparisonSection serverData={allPlantsLatest} />
      <PlantsGridSection serverLatest={allPlantsLatest} />

      <footer className="border-t border-[var(--industrial-line)] bg-[var(--industrial-bg)] px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono-industrial text-[11px] tracking-[0.2em] text-[var(--steel)]">
            OEE COMMAND CENTER — DIGITAL MANUFACTURING OBSERVATION SYSTEM
          </p>
          <p className="font-mono-industrial text-[11px] text-[var(--steel)]">SECTOR 25 · SECTOR 69 · SECTOR 58 · UNIT 94 · UNIT 97</p>
        </div>
      </footer>
    </main>
  );
}
