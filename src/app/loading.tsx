import { SkeletonHero, SkeletonGrid } from "@/components/system/skeleton";
import { FeaturePageRoot, FeaturePageShell } from "@/components/layout/feature-page-shell";

export default function Loading() {
  return (
    <FeaturePageRoot>
      <SkeletonHero />
      <FeaturePageShell>
        <SkeletonGrid count={4} />
      </FeaturePageShell>
    </FeaturePageRoot>
  );
}
