import { X, Check } from 'lucide-react';
import { Theme, useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  bestFor: string;
}

const themes: ThemeOption[] = [
  {
    id: 'neo-brutalism',
    name: 'Soft Neo-Brutalism',
    description: 'Modern, friendly, educational',
    bestFor: 'Default experience',
  },
  {
    id: 'light',
    name: 'Light Professional',
    description: 'Calm, analytical, professional',
    bestFor: 'Office, study, long sessions',
  },
  {
    id: 'dark',
    name: 'Dark Professional',
    description: 'Serious, focused, low eye strain',
    bestFor: 'Night work, extended use',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Energetic but still readable',
    bestFor: 'Enthusiasts, gamers',
  },
];

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-4xl rounded-2xl"
        style={{
          backgroundColor: 'var(--container-bg)',
          border: `var(--border-width) solid var(--border-color)`,
          boxShadow: 'var(--shadow-large)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{
            borderBottom: `var(--border-width) solid var(--border-light)`,
          }}
        >
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Select Theme
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Choose your preferred color scheme
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-all"
            style={{
              color: 'var(--text-secondary)',
              border: `var(--border-width) solid var(--border-light)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--panel-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((themeOption) => (
            <ThemeCard
              key={themeOption.id}
              theme={themeOption}
              isSelected={theme === themeOption.id}
              onSelect={() => handleThemeSelect(themeOption.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className="relative text-left rounded-xl p-5 transition-all"
      style={{
        backgroundColor: 'var(--panel-bg)',
        border: isSelected
          ? `3px solid var(--accent-primary)`
          : `var(--border-width) solid var(--border-light)`,
        boxShadow: isSelected ? 'var(--shadow-medium)' : 'var(--shadow-small)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = 'var(--hover-transform)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = 'var(--shadow-small)';
        }
      }}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 rounded-full p-1"
          style={{
            backgroundColor: 'var(--accent-primary)',
          }}
        >
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Theme Preview */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <ThemePreview themeId={theme.id} />
      </div>

      {/* Theme Info */}
      <div>
        <h3
          className="font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {theme.name}
        </h3>
        <p
          className="text-sm mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme.description}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Best for: {theme.bestFor}
        </p>
      </div>
    </button>
  );
}

interface ThemePreviewProps {
  themeId: Theme;
}

function ThemePreview({ themeId }: ThemePreviewProps) {
  const themeStyles: Record<Theme, React.CSSProperties> = {
    'neo-brutalism': {
      backgroundColor: '#FAF8F5',
      borderColor: '#1f2937',
    },
    light: {
      backgroundColor: '#f5f5f0',
      borderColor: '#9ca3af',
    },
    dark: {
      backgroundColor: '#1a1a1a',
      borderColor: '#525252',
    },
    gaming: {
      backgroundColor: '#0a0a0a',
      borderColor: '#00ff88',
    },
  };

  const cardStyles: Record<Theme, string[]> = {
    'neo-brutalism': ['#FFE8E8', '#E8F4FF', '#F0E8FF'],
    light: ['#e8eef5', '#f0f4f8', '#f5f0f8'],
    dark: ['#333333', '#2f3542', '#3d3042'],
    gaming: ['#1a1a1a', '#1a1a1a', '#1a1a1a'],
  };

  const textColors: Record<Theme, string> = {
    'neo-brutalism': '#2d2d2d',
    light: '#1f2937',
    dark: '#f5f5f5',
    gaming: '#ffffff',
  };

  const accentColors: Record<Theme, string> = {
    'neo-brutalism': '#E8B923',
    light: '#3b82f6',
    dark: '#60a5fa',
    gaming: '#00ff88',
  };

  return (
    <div
      className="p-3 rounded-lg"
      style={{
        ...themeStyles[themeId],
        border: `2px solid ${themeStyles[themeId].borderColor}`,
        minHeight: '140px',
      }}
    >
      {/* Mini header */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="h-2 w-16 rounded"
          style={{ backgroundColor: textColors[themeId] }}
        ></div>
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColors[themeId] }}
        ></div>
      </div>

      {/* Mini cards */}
      <div className="space-y-2">
        {cardStyles[themeId].slice(0, 3).map((color, i) => (
          <div
            key={i}
            className="rounded-md p-2 flex items-center justify-between"
            style={{
              backgroundColor: color,
              border: `1px solid ${themeStyles[themeId].borderColor}`,
            }}
          >
            <div
              className="h-1.5 w-12 rounded"
              style={{ backgroundColor: textColors[themeId], opacity: 0.6 }}
            ></div>
            <div
              className="h-1.5 w-8 rounded"
              style={{ backgroundColor: accentColors[themeId], opacity: 0.8 }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
