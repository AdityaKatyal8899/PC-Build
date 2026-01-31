import { useState } from 'react';
import { ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';
import { PCBuild } from '../App';
import { getCompatibilityChecks } from '../utils/evaluator';

interface CompatibilityChecksProps {
  build: PCBuild;
}

export function CompatibilityChecks({ build }: CompatibilityChecksProps) {
  const checks = getCompatibilityChecks(build);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
        Compatibility & Balance
      </h3>

      {checks.map((check, index) => (
        <div
          key={index}
          className="rounded-lg sm:rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--container-bg)',
            border: `var(--border-width) solid var(--border-color)`,
            boxShadow: 'var(--shadow-small)',
          }}
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                  {check.title}
                </p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {check.message}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold"
                  style={{
                    backgroundColor: check.status === 'ideal'
                      ? 'var(--status-ideal-bg)'
                      : check.status === 'good'
                      ? 'var(--status-good-bg)'
                      : check.status === 'warning'
                      ? 'var(--status-warning-bg)'
                      : 'var(--status-error-bg)',
                    border: `2px solid ${
                      check.status === 'ideal'
                        ? 'var(--status-ideal-border)'
                        : check.status === 'good'
                        ? 'var(--status-good-border)'
                        : check.status === 'warning'
                        ? 'var(--status-warning-border)'
                        : 'var(--status-error-border)'
                    }`,
                    color: check.status === 'ideal'
                      ? 'var(--status-ideal-text)'
                      : check.status === 'good'
                      ? 'var(--status-good-text)'
                      : check.status === 'warning'
                      ? 'var(--status-warning-text)'
                      : 'var(--status-error-text)',
                  }}
                >
                  {check.statusLabel}
                </span>
                {check.explanation && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {expandedIndex === index ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expandable "Why?" section */}
          {check.explanation && expandedIndex === index && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
              <div 
                className="rounded-lg p-3 sm:p-4"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  border: `var(--border-width) solid var(--border-light)`,
                }}
              >
                <p className="text-xs sm:text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Why?
                </p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {check.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}