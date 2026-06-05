'use client';

import { useMemo } from 'react';
import { FeatureEmpty } from '@/components/system/feature-empty';
import { WorkspaceCommandCenter } from '@/components/dashboard/workspace-command-center';
import { FeaturePageRoot } from '@/components/layout/feature-page-shell';
import { useMaterials } from '@/lib/material-context';
import { useApplications } from '@/lib/application-context';
import { useLocale } from '@/lib/i18n/locale-context';
import type { MaterialCategory } from '@/types/material';

export default function DashboardPage() {
  const { t } = useLocale();
  const d = t.dashboard;
  const { materials } = useMaterials();
  const { applications, stats: appStats } = useApplications();

  const categoryBreakdown = (['internship', 'project', 'competition', 'research', 'campus'] as MaterialCategory[]).map(
    (cat) => ({
      category: cat,
      count: materials.filter((m) => m.category === cat).length,
    })
  );

  const recommendedSkills = [
    { skill: 'SQL', level: d.skillLevels.master, urgency: 'high' as const },
    { skill: d.skillUserResearch, level: d.skillLevels.learn, urgency: 'medium' as const },
    { skill: 'A/B Test', level: d.skillLevels.basic, urgency: 'medium' as const },
    { skill: d.skillDataViz, level: d.skillLevels.improve, urgency: 'low' as const },
  ];

  const avgMatch = useMemo(() => {
    const scored = applications.filter((a) => a.matchScore != null);
    if (scored.length === 0) return materials.length > 0 ? '—' : '0%';
    const avg = Math.round(
      scored.reduce((sum, a) => sum + (a.matchScore ?? 0), 0) / scored.length
    );
    return `${avg}%`;
  }, [applications, materials.length]);

  const isEmpty = materials.length === 0;

  return (
    <FeaturePageRoot className="system-page">
      {isEmpty ? (
        <div className="brand-editorial-width py-16 md:py-24 px-4">
          <FeatureEmpty
            page="dashboard"
            title={d.emptyTitle}
            description={d.emptyDesc}
            primaryLabel={d.emptyCta}
            primaryHref="/materials"
          />
        </div>
      ) : (
        <WorkspaceCommandCenter
          materials={materials}
          materialsCount={materials.length}
          applications={applications}
          applicationsTotal={appStats.total}
          interviewRate={appStats.interviewRate}
          avgMatch={avgMatch}
          wishlistCount={appStats.byStatus.wishlist}
          categoryBreakdown={categoryBreakdown}
          recommendedSkills={recommendedSkills}
        />
      )}
    </FeaturePageRoot>
  );
}
