import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBudget, Currency } from '../contexts/BudgetContext';
import { Slider } from '../components/ui/slider';

export function BudgetSetup() {
  const navigate = useNavigate();
  const { budget, currency, setBudget, setCurrency, formatCurrency } = useBudget();
  
  const [localBudget, setLocalBudget] = useState(budget || (currency === 'INR' ? 80000 : 1100));

  // Currency conversion rates (approximate)
  const minBudget = currency === 'INR' ? 20000 : 300;
  const maxBudget = currency === 'INR' ? 300000 : 4000;
  const step = currency === 'INR' ? 5000 : 100;

  const handleContinue = () => {
    setBudget(localBudget);
    navigate('/build');
  };

  const handleCurrencySwitch = (newCurrency: Currency) => {
    // Convert budget when switching currencies
    if (currency === 'INR' && newCurrency === 'USD') {
      setLocalBudget(Math.round(localBudget / 75)); // Rough conversion
    } else if (currency === 'USD' && newCurrency === 'INR') {
      setLocalBudget(Math.round(localBudget * 75));
    }
    setCurrency(newCurrency);
  };

  const getBudgetFeedback = () => {
    if (currency === 'INR') {
      if (localBudget < 30000) return { text: 'Entry-level build', type: 'warning' };
      if (localBudget < 50000) return { text: 'Budget 1080p gaming', type: 'good' };
      if (localBudget < 80000) return { text: 'Ideal for 1080p gaming', type: 'ideal' };
      if (localBudget < 120000) return { text: 'Balanced mid-range build', type: 'ideal' };
      if (localBudget < 200000) return { text: 'High-performance enthusiast build', type: 'ideal' };
      return { text: 'Extreme/Professional build', type: 'ideal' };
    } else {
      if (localBudget < 400) return { text: 'Entry-level build', type: 'warning' };
      if (localBudget < 700) return { text: 'Budget 1080p gaming', type: 'good' };
      if (localBudget < 1100) return { text: 'Ideal for 1080p gaming', type: 'ideal' };
      if (localBudget < 1600) return { text: 'Balanced mid-range build', type: 'ideal' };
      if (localBudget < 2700) return { text: 'High-performance enthusiast build', type: 'ideal' };
      return { text: 'Extreme/Professional build', type: 'ideal' };
    }
  };

  const feedback = getBudgetFeedback();

  const getStatusStyle = (type: string) => {
    switch (type) {
      case 'ideal':
        return {
          backgroundColor: 'var(--status-ideal-bg)',
          color: 'var(--status-ideal-text)',
          borderColor: 'var(--status-ideal-border)',
        };
      case 'good':
        return {
          backgroundColor: 'var(--status-good-bg)',
          color: 'var(--status-good-text)',
          borderColor: 'var(--status-good-border)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--status-warning-bg)',
          color: 'var(--status-warning-text)',
          borderColor: 'var(--status-warning-border)',
        };
      default:
        return {
          backgroundColor: 'var(--status-good-bg)',
          color: 'var(--status-good-text)',
          borderColor: 'var(--status-good-border)',
        };
    }
  };

  return (
    <div 
      className="min-h-screen py-6 sm:py-12 lg:py-20 px-4 sm:px-6"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Main Card */}
        <div 
          className="rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-12"
          style={{
            backgroundColor: 'var(--container-bg)',
            border: `var(--border-width) solid var(--border-color)`,
            boxShadow: 'var(--shadow-large)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Set Your PC Build Budget
            </h1>
            <p 
              className="text-sm sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              We'll optimize components to give you the best performance within your budget.
            </p>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => handleCurrencySwitch('USD')}
              className="px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: currency === 'USD' ? 'var(--accent-primary)' : 'var(--panel-bg)',
                color: currency === 'USD' ? '#ffffff' : 'var(--text-secondary)',
                border: `var(--border-width) solid ${currency === 'USD' ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                boxShadow: currency === 'USD' ? 'var(--shadow-small)' : 'none',
              }}
            >
              USD ($)
            </button>
            <button
              onClick={() => handleCurrencySwitch('INR')}
              className="px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: currency === 'INR' ? 'var(--accent-primary)' : 'var(--panel-bg)',
                color: currency === 'INR' ? '#ffffff' : 'var(--text-secondary)',
                border: `var(--border-width) solid ${currency === 'INR' ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                boxShadow: currency === 'INR' ? 'var(--shadow-small)' : 'none',
              }}
            >
              INR (₹)
            </button>
          </div>

          {/* Budget Input */}
          <div className="mb-8">
            <label 
              htmlFor="budget-input"
              className="block mb-3 text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              Total Budget
            </label>
            <div className="relative">
              <span 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {currency === 'INR' ? '₹' : '$'}
              </span>
              <input
                id="budget-input"
                type="number"
                value={localBudget}
                onChange={(e) => setLocalBudget(Number(e.target.value))}
                min={minBudget}
                max={maxBudget}
                step={step}
                className="w-full text-center text-3xl sm:text-4xl font-bold py-4 px-4 rounded-xl transition-all"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: `var(--border-width) solid var(--input-border)`,
                  boxShadow: 'var(--shadow-small)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--hover-transform)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-small)';
                }}
              />
            </div>
            <p 
              className="mt-3 text-xs sm:text-sm text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              This is your total budget for CPU, GPU, RAM, and motherboard.
            </p>
          </div>

          {/* Slider */}
          <div className="mb-8 px-2">
            <Slider
              value={[localBudget]}
              onValueChange={(values) => setLocalBudget(values[0])}
              min={minBudget}
              max={maxBudget}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{formatCurrency(minBudget)}</span>
              <span>{formatCurrency(maxBudget)}</span>
            </div>
          </div>

          {/* Budget Feedback */}
          <div 
            className="mb-8 p-4 rounded-xl text-center font-medium"
            style={{
              ...getStatusStyle(feedback.type),
              border: `var(--border-width) solid ${getStatusStyle(feedback.type).borderColor}`,
            }}
          >
            {feedback.text}
          </div>

          {/* Warning for very low budgets */}
          {((currency === 'INR' && localBudget < 30000) || (currency === 'USD' && localBudget < 400)) && (
            <div 
              className="mb-8 p-4 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                color: 'var(--status-warning-text)',
                border: `var(--border-width) solid var(--status-warning-border)`,
              }}
            >
              ⚠️ Very low budget may limit component options and performance expectations.
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={localBudget < minBudget}
            className="w-full py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: localBudget >= minBudget ? 'var(--accent-primary)' : 'var(--panel-bg)',
              color: localBudget >= minBudget ? '#ffffff' : 'var(--text-muted)',
              border: `var(--border-width) solid ${localBudget >= minBudget ? 'var(--accent-primary)' : 'var(--border-light)'}`,
              boxShadow: localBudget >= minBudget ? 'var(--shadow-medium)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (localBudget >= minBudget) {
                e.currentTarget.style.boxShadow = 'var(--hover-transform)';
              }
            }}
            onMouseLeave={(e) => {
              if (localBudget >= minBudget) {
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }
            }}
          >
            Continue to Build
          </button>

          {/* Skip Button */}
          <button
            onClick={() => {
              setBudget(0); // Set budget to 0 to indicate no budget set
              navigate('/build');
            }}
            className="w-full mt-3 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            Skip for now
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>You can adjust your budget anytime during the build process</p>
        </div>
      </div>
    </div>
  );
}