import { useState } from 'react';
import { Palette } from 'lucide-react';
import { ComponentSelector } from './components/ComponentSelector';
import { SystemAnalysis } from './components/SystemAnalysis';
import { ThemeSelector } from './components/ThemeSelector';
import { ThemeProvider } from './contexts/ThemeContext';

export type ComponentType = 'motherboard' | 'cpu' | 'gpu' | 'ram';

export interface PCBuild {
  motherboard: string;
  cpu: string;
  gpu: string;
  ram: string;
}

function AppContent() {
  const [build, setBuild] = useState<PCBuild>({
    motherboard: '',
    cpu: '',
    gpu: '',
    ram: '',
  });
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  const handleComponentChange = (type: ComponentType, value: string) => {
    setBuild(prev => ({ ...prev, [type]: value }));
  };

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

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Panel - Component Selection (40%) */}
          <div 
            className="lg:col-span-2 rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--container-bg)',
              border: `var(--border-width) solid var(--border-color)`,
              boxShadow: 'var(--shadow-large)',
            }}
          >
            <ComponentSelector build={build} onChange={handleComponentChange} />
          </div>

          {/* Right Panel - System Analysis (60%) */}
          <div 
            className="lg:col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-6 lg:p-8"
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;