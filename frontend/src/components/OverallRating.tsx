import { Zap, ThumbsUp, TrendingUp, Flame, AlertTriangle } from 'lucide-react';
import { PCBuild } from '../App';
import { getOverallRating } from '../utils/evaluator';

interface OverallRatingProps {
  build: PCBuild;
}

export function OverallRating({ build }: OverallRatingProps) {
  const rating = getOverallRating(build);

  const ratingConfig = {
    overkill: {
      icon: <Flame className="w-12 h-12" />,
      bg: 'var(--status-error-bg)',
      border: 'var(--status-error-border)',
      text: 'var(--status-error-text)',
    },
    beast: {
      icon: <Zap className="w-12 h-12" />,
      bg: 'var(--status-ideal-bg)',
      border: 'var(--status-ideal-border)',
      text: 'var(--status-ideal-text)',
    },
    good: {
      icon: <ThumbsUp className="w-12 h-12" />,
      bg: 'var(--status-good-bg)',
      border: 'var(--status-good-border)',
      text: 'var(--status-good-text)',
    },
    decent: {
      icon: <TrendingUp className="w-12 h-12" />,
      bg: 'var(--status-warning-bg)',
      border: 'var(--status-warning-border)',
      text: 'var(--status-warning-text)',
    },
    cooked: {
      icon: <AlertTriangle className="w-12 h-12" />,
      bg: 'var(--status-error-bg)',
      border: 'var(--status-error-border)',
      text: 'var(--status-error-text)',
    },
  };

  const config = ratingConfig[rating.level];

  return (
    <div
      className="rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8"
      style={{
        backgroundColor: config.bg,
        border: `var(--border-width) solid ${config.border}`,
        boxShadow: 'var(--shadow-medium)',
      }}
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:block" style={{ color: config.text }}>{config.icon}</div>
        <div className="flex-1">
          <h3 
            className="text-xs sm:text-sm font-bold uppercase tracking-wide mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Overall Build Rating
          </h3>
          <p 
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: config.text }}
          >
            {rating.label}
          </p>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            {rating.description}
          </p>
        </div>
      </div>
    </div>
  );
}