import { ReactNode } from 'react';
import { useComponents, NormalizedComponentOption } from '../contexts/ComponentContext';
import { PCBuild, ComponentType } from '../types';
import { getComponentStatus } from '../utils/evaluator';
import { SearchableSelect } from './SearchableSelect';
import { useBudget } from '../contexts/BudgetContext';

interface ComponentCardProps {
  icon: ReactNode;
  label: string;
  options: NormalizedComponentOption[];
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
  const { components } = useComponents();
  const status = getComponentStatus(build, type, components);
  const { currency, formatCurrency } = useBudget();

  // Find the selected component to get its price
  const selectedComponent = options.find(opt => opt.value === value);
  const price = selectedComponent
    ? (currency === 'INR' ? selectedComponent.priceINR : selectedComponent.priceUSD)
    : 0;

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
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{label}</h3>
        </div>
        {value && selectedComponent && (
          <div
            className="px-3 py-1 rounded-lg font-bold text-sm"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
            }}
          >
            {formatCurrency(price)}
          </div>
        )}
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
              border: `2px solid ${status.type === 'ideal'
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