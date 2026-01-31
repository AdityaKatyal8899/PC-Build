import { PCBuild } from '../App';
import { OverallRating } from './OverallRating';
import { CompatibilityChecks } from './CompatibilityChecks';
import { PerformanceEstimate } from './PerformanceEstimate';

interface SystemAnalysisProps {
  build: PCBuild;
}

export function SystemAnalysis({ build }: SystemAnalysisProps) {
  const hasAllComponents = build.motherboard && build.cpu && build.gpu && build.ram;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>
        System Analysis
      </h2>

      {!hasAllComponents ? (
        <div 
          className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
          style={{
            backgroundColor: 'var(--container-bg)',
            border: `var(--border-width) solid var(--border-light)`,
          }}
        >
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            Select all components to see analysis
          </p>
        </div>
      ) : (
        <>
          <OverallRating build={build} />
          <CompatibilityChecks build={build} />
          <PerformanceEstimate build={build} />
        </>
      )}
    </div>
  );
}