import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'INR' | 'USD';

interface BudgetContextType {
  budget: number;
  currency: Currency;
  setBudget: (budget: number) => void;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudgetState] = useState<number>(0);
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    // Load from localStorage on mount
    const savedBudget = localStorage.getItem('pc-builder-budget');
    const savedCurrency = localStorage.getItem('pc-builder-currency') as Currency;
    
    if (savedBudget) {
      setBudgetState(Number(savedBudget));
    }
    if (savedCurrency && ['INR', 'USD'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setBudget = (newBudget: number) => {
    setBudgetState(newBudget);
    localStorage.setItem('pc-builder-budget', newBudget.toString());
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('pc-builder-currency', newCurrency);
  };

  const formatCurrency = (amount: number): string => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `$${amount.toLocaleString('en-US')}`;
  };

  return (
    <BudgetContext.Provider value={{ budget, currency, setBudget, setCurrency, formatCurrency }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
