import { ReactNode } from 'react';
import { PCBuild, ComponentType } from '../App';
import { getComponentStatus } from '../utils/evaluator';
import { SearchableSelect } from './SearchableSelect';

interface ComponentCardProps {
  icon: ReactNode;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  build: PCBuild;
  type: ComponentType;
  bgColor: string;
}

export function ComponentCard({
  icon,
  label,
  options,
  value,
  onChange,
  build,
  type,
  bgColor,
}: ComponentCardProps) {
  const status = getComponentStatus(build, type);

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 transition-all"
      style={{
        backgroundColor: bgColor,
        border: `var(--border-width) solid var(--border-color)`,
        boxShadow: 'var(--shadow-small)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--hover-transform)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-small)';
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{label}</h3>
      </div>

      {/* Searchable Select */}
      <SearchableSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Search ${label}...`}
      />

      {/* Status Badge */}
      {value && status && (
        <div className="mt-4">
          <span
            className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold"
            style={{
              backgroundColor: status.type === 'ideal'
                ? 'var(--status-ideal-bg)'
                : status.type === 'good'
                ? 'var(--status-good-bg)'
                : status.type === 'warning'
                ? 'var(--status-warning-bg)'
                : 'var(--status-error-bg)',
              border: `2px solid ${
                status.type === 'ideal'
                  ? 'var(--status-ideal-border)'
                  : status.type === 'good'
                  ? 'var(--status-good-border)'
                  : status.type === 'warning'
                  ? 'var(--status-warning-border)'
                  : 'var(--status-error-border)'
              }`,
              color: status.type === 'ideal'
                ? 'var(--status-ideal-text)'
                : status.type === 'good'
                ? 'var(--status-good-text)'
                : status.type === 'warning'
                ? 'var(--status-warning-text)'
                : 'var(--status-error-text)',
            }}
          >
            {status.label}
          </span>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {status.message}
          </p>
        </div>
      )}
    </div>
  );
}