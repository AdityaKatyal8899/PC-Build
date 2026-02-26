import { Target } from 'lucide-react';
import { PCBuild } from '../types';
import { getPerformanceEstimate } from '../utils/evaluator';

import { useComponents } from '../contexts/ComponentContext';

interface PerformanceEstimateProps {
  build: PCBuild;
}

export function PerformanceEstimate({ build }: PerformanceEstimateProps) {
  const { components } = useComponents();
  const performance = getPerformanceEstimate(build, components);

  return (
    <div
      className="rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6"
      style={{
        backgroundColor: 'var(--container-bg)',
        border: `var(--border-width) solid var(--border-color)`,
        boxShadow: 'var(--shadow-small)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--text-muted)' }} />
        <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
          Estimated Performance
        </h3>
      </div>

      <div className="space-y-2">
        {performance.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--text-primary)' }}
            ></div>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}