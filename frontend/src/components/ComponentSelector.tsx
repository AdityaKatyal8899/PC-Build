import { Cpu, Microchip, Monitor, MemoryStick, Zap } from 'lucide-react';
import { ComponentCard } from './ComponentCard';
import { PCBuild, ComponentType } from '../types';
import { useComponents } from '../contexts/ComponentContext';
import { useBudget } from '../contexts/BudgetContext';

interface ComponentSelectorProps {
  build: PCBuild;
  onChange: (type: ComponentType, value: string) => void;
}

export function ComponentSelector({ build, onChange }: ComponentSelectorProps) {
  const { budget, currency, formatCurrency } = useBudget();
  const { components } = useComponents();

  // Calculate total cost
  let totalCost = 0;

  if (build.motherboard) {
    const component = components.motherboards.find(c => c.value === build.motherboard);
    if (component) {
      totalCost += currency === 'INR' ? component.priceINR : component.priceUSD;
    }
  }

  if (build.cpu) {
    const component = components.cpus.find(c => c.value === build.cpu);
    if (component) {
      totalCost += currency === 'INR' ? component.priceINR : component.priceUSD;
    }
  }

  if (build.gpu) {
    const component = components.gpus.find(c => c.value === build.gpu);
    if (component) {
      totalCost += currency === 'INR' ? component.priceINR : component.priceUSD;
    }
  }

  if (build.ram) {
    const component = components.rams.find(c => c.value === build.ram);
    if (component) {
      totalCost += currency === 'INR' ? component.priceINR : component.priceUSD;
    }
  }

  if (build.psu) {
    const component = components.psus.find(c => c.value === build.psu);
    if (component) {
      totalCost += currency === 'INR' ? component.priceINR : component.priceUSD;
    }
  }

  const isOverBudget = budget > 0 && totalCost > budget;
  const hasComponents = build.motherboard || build.cpu || build.gpu || build.ram || build.psu;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Build Your PC
        </h2>
        {hasComponents && (
          <div
            className="px-3 py-1.5 rounded-lg font-bold text-sm"
            style={{
              backgroundColor: isOverBudget ? 'var(--status-error-bg)' : 'var(--status-good-bg)',
              color: isOverBudget ? 'var(--status-error-text)' : 'var(--status-good-text)',
              border: `2px solid ${isOverBudget ? 'var(--status-error-border)' : 'var(--status-good-border)'}`,
            }}
          >
            {formatCurrency(totalCost)}
          </div>
        )}
      </div>

      {isOverBudget && (
        <div
          className="p-4 rounded-xl text-sm mb-4 sm:mb-6"
          style={{
            backgroundColor: 'var(--status-error-bg)',
            color: 'var(--status-error-text)',
            border: `var(--border-width) solid var(--status-error-border)`,
          }}
        >
          ⚠️ Current build exceeds your budget by {formatCurrency(totalCost - budget)}
        </div>
      )}

      {/* Horizontal Grid Layout - 2 per row, rectangular cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <ComponentCard
          icon={<Microchip className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="Motherboard"
          options={components.motherboards}
          value={build.motherboard}
          onChange={(value) => onChange('motherboard', value)}
          build={build}
          type="motherboard"
          bgColor="var(--card-bg-1)"
        />

        <ComponentCard
          icon={<Cpu className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="CPU"
          options={components.cpus}
          value={build.cpu}
          onChange={(value) => onChange('cpu', value)}
          build={build}
          type="cpu"
          bgColor="var(--card-bg-2)"
        />

        <ComponentCard
          icon={<Monitor className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="GPU"
          options={components.gpus}
          value={build.gpu}
          onChange={(value) => onChange('gpu', value)}
          build={build}
          type="gpu"
          bgColor="var(--card-bg-3)"
        />

        <ComponentCard
          icon={<MemoryStick className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="RAM"
          options={components.rams}
          value={build.ram}
          onChange={(value) => onChange('ram', value)}
          build={build}
          type="ram"
          bgColor="var(--card-bg-4)"
        />

        <ComponentCard
          icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="PSU"
          options={components.psus}
          value={build.psu}
          onChange={(value) => onChange('psu', value)}
          build={build}
          type="psu"
          bgColor="var(--card-bg-1)"
        />
      </div>
    </div>
  );
}