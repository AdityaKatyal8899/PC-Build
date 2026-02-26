import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { NormalizedComponentOption } from '../contexts/ComponentContext';
import { useBudget } from '../contexts/BudgetContext';

interface SearchableSelectProps {
  options: NormalizedComponentOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showResultCount, setShowResultCount] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    openUpward: boolean;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultCountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currency, formatCurrency } = useBudget();

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || '';

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        const dropdownHeight = 280; // max-height of dropdown
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        setDropdownPosition({
          top: openUpward ? rect.top : rect.bottom,
          left: rect.left,
          width: rect.width,
          openUpward,
        });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen]);

  // Show result count when search term changes
  useEffect(() => {
    if (searchTerm && isOpen) {
      setShowResultCount(true);

      // Clear existing timeout
      if (resultCountTimeoutRef.current) {
        clearTimeout(resultCountTimeoutRef.current);
      }

      // Auto-dismiss after 2.5 seconds
      resultCountTimeoutRef.current = setTimeout(() => {
        setShowResultCount(false);
      }, 2500);
    } else {
      setShowResultCount(false);
    }

    return () => {
      if (resultCountTimeoutRef.current) {
        clearTimeout(resultCountTimeoutRef.current);
      }
    };
  }, [searchTerm, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        setShowResultCount(false);
        if (resultCountTimeoutRef.current) {
          clearTimeout(resultCountTimeoutRef.current);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
    setShowResultCount(false);
    if (resultCountTimeoutRef.current) {
      clearTimeout(resultCountTimeoutRef.current);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === 'ArrowDown')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        setShowResultCount(false);
        if (resultCountTimeoutRef.current) {
          clearTimeout(resultCountTimeoutRef.current);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div
        className="relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium cursor-text"
        style={{
          backgroundColor: 'var(--input-bg)',
          border: `var(--border-width) solid ${isOpen ? 'var(--accent-primary)' : 'var(--input-border)'
            }`,
        }}
        onClick={handleInputClick}
      >
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFocusedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
          style={{ color: 'var(--text-primary)' }}
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <button
              onClick={handleClear}
              className="p-1 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        </div>
      </div>

      {/* Dropdown List - Floating Layer */}
      {isOpen && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="rounded-xl overflow-hidden"
          style={{
            position: 'fixed',
            top: dropdownPosition.openUpward
              ? `${dropdownPosition.top - 288}px` // 280px height + 8px gap
              : `${dropdownPosition.top + 8}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999,
            backgroundColor: 'var(--container-bg)',
            border: `var(--border-width) solid var(--border-color)`,
            boxShadow: 'var(--shadow-large)',
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {filteredOptions.length === 0 ? (
            <div
              className="px-4 py-3 text-sm text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              No matching components found
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className="w-full px-4 py-3 text-left transition-colors"
                style={{
                  backgroundColor:
                    focusedIndex === index
                      ? 'var(--panel-bg)'
                      : value === option.value
                        ? 'var(--panel-bg)'
                        : 'transparent',
                  color: 'var(--text-primary)',
                  borderBottom:
                    index < filteredOptions.length - 1
                      ? `1px solid var(--border-light)`
                      : 'none',
                }}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-1">{option.label}</span>
                  <span
                    className="text-sm font-bold flex-shrink-0"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {formatCurrency(currency === 'INR' ? option.priceINR : option.priceUSD)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Result Count Toast */}
      {showResultCount && searchTerm && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 px-3 py-2 rounded-lg text-xs transition-opacity"
          style={{
            backgroundColor: 'var(--panel-bg)',
            color: 'var(--text-secondary)',
            border: `var(--border-width) solid var(--border-light)`,
            boxShadow: 'var(--shadow-small)',
          }}
        >
          {filteredOptions.length === 0
            ? 'No matching components found'
            : `${filteredOptions.length} result${filteredOptions.length === 1 ? '' : 's'} found — select the one that fits your build`
          }
        </div>
      )}
    </div>
  );
}