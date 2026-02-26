import { useState, useMemo } from 'react';
import { Palette, DollarSign, Edit2 } from 'lucide-react';
import { ComponentSelector } from '../components/ComponentSelector';
import { SystemAnalysis } from '../components/SystemAnalysis';
import { ThemeSelector } from '../components/ThemeSelector';
import { useBudget } from '../contexts/BudgetContext';
import { PCBuild, ComponentType } from '../types';
import { useComponents } from '../contexts/ComponentContext';

export function BuilderPage() {
  const [build, setBuild] = useState<PCBuild>({
    motherboard: '',
    cpu: '',
    gpu: '',
    ram: '',
    psu: '',
  });
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isBudgetPanelOpen, setIsBudgetPanelOpen] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(0);
  const { budget, formatCurrency, setBudget, currency } = useBudget();
  const { components, isLoading, error } = useComponents();

  const handleComponentChange = (type: ComponentType, value: string) => {
    setBuild(prev => ({ ...prev, [type]: value }));
  };

  // Calculate estimated build cost based on selected components
  const estimatedCost = useMemo(() => {
    if (isLoading || error) return 0;

    let total = 0;

    if (build.motherboard) {
      const component = components.motherboards.find(c => c.value === build.motherboard);
      if (component) {
        total += currency === 'INR' ? component.priceINR : component.priceUSD;
      }
    }

    if (build.cpu) {
      const component = components.cpus.find(c => c.value === build.cpu);
      if (component) {
        total += currency === 'INR' ? component.priceINR : component.priceUSD;
      }
    }

    if (build.gpu) {
      const component = components.gpus.find(c => c.value === build.gpu);
      if (component) {
        total += currency === 'INR' ? component.priceINR : component.priceUSD;
      }
    }

    if (build.ram) {
      const component = components.rams.find(c => c.value === build.ram);
      if (component) {
        total += currency === 'INR' ? component.priceINR : component.priceUSD;
      }
    }

    if (build.psu) {
      const component = components.psus.find(c => c.value === build.psu);
      if (component) {
        total += currency === 'INR' ? component.priceINR : component.priceUSD;
      }
    }

    return total;
  }, [build, currency, components, isLoading, error]);

  const remainingBudget = budget - estimatedCost;

  return (
    <div
      className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              PC Builder
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Build your system and evaluate performance in real-time
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Budget Info Button */}
            <button
              onClick={() => setIsBudgetPanelOpen(!isBudgetPanelOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: 'var(--container-bg)',
                color: 'var(--text-primary)',
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
              <DollarSign className="w-5 h-5" />
              <span className="hidden sm:inline">Budget</span>
            </button>

            {/* Theme Selector Button */}
            <button
              onClick={() => setIsThemeSelectorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: 'var(--container-bg)',
                color: 'var(--text-primary)',
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
              <Palette className="w-5 h-5" />
              <span className="hidden sm:inline">Theme</span>
            </button>
          </div>
        </div>

        {/* Budget Summary Panel - Collapsible */}
        {isBudgetPanelOpen && (
          <div
            className="mb-6 rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6"
            style={{
              backgroundColor: 'var(--container-bg)',
              border: `var(--border-width) solid var(--border-color)`,
              boxShadow: 'var(--shadow-large)',
            }}
          >
            {!isEditingBudget ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Your Budget
                  </h3>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                    {budget > 0 ? formatCurrency(budget) : 'No budget set'}
                  </p>
                </div>

                {budget > 0 && (
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        Estimated Cost
                      </p>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(estimatedCost)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        Remaining
                      </p>
                      <p
                        className="font-bold"
                        style={{
                          color: remainingBudget >= 0 ? 'var(--accent-success)' : 'var(--accent-error)'
                        }}
                      >
                        {formatCurrency(remainingBudget)}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setTempBudget(budget);
                    setIsEditingBudget(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--panel-bg)',
                    color: 'var(--text-primary)',
                    border: `var(--border-width) solid var(--border-light)`,
                    boxShadow: 'var(--shadow-small)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--hover-transform)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-small)';
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Budget
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  Edit Budget
                </h3>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="w-full text-xl font-bold py-3 px-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `var(--border-width) solid var(--input-border)`,
                    boxShadow: 'var(--shadow-small)',
                  }}
                  placeholder="Enter new budget"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setBudget(tempBudget);
                      setIsEditingBudget(false);
                    }}
                    className="flex-1 py-2 rounded-xl font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      border: `var(--border-width) solid var(--accent-primary)`,
                      boxShadow: 'var(--shadow-small)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--hover-transform)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-small)';
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingBudget(false)}
                    className="flex-1 py-2 rounded-xl font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--panel-bg)',
                      color: 'var(--text-secondary)',
                      border: `var(--border-width) solid var(--border-light)`,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Container - Vertical Stack */}
        <div className="space-y-4 sm:space-y-6">
          {/* Build Your PC Panel */}
          <div
            className="rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--container-bg)',
              border: `var(--border-width) solid var(--border-color)`,
              boxShadow: 'var(--shadow-large)',
            }}
          >
            <ComponentSelector build={build} onChange={handleComponentChange} />
          </div>

          {/* System Analysis Panel */}
          <div
            className="rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--container-bg)',
              border: `var(--border-width) solid var(--border-color)`,
              boxShadow: 'var(--shadow-large)',
            }}
          >
            <SystemAnalysis build={build} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>Select components to see compatibility and performance insights</p>
        </div>
      </div>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />
    </div>
  );
}