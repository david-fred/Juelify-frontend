import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { Severity, PostType } from '@/api/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  severity?: Severity;
  type?: PostType;
  dateFrom?: string;
  dateTo?: string;
}

const severities: Severity[] = ['urgent', 'important', 'general'];
const postTypes: PostType[] = ['announcement', 'poll', 'contribution', 'question'];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const hasFilters = Object.values(filters).some(Boolean);

  const updateFilter = (update: Partial<FilterState>) => {
    const next = { ...filters, ...update };
    setFilters(next);
    onFilterChange(next);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition
            ${hasFilters
              ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
              : 'bg-surface-raised text-text-muted border-surface-border hover:border-brand-500/30'
            }
          `}
        >
          <Filter size={14} />
          Filters
          {hasFilters && (
            <span className="bg-brand-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-text-muted hover:text-red-400 flex items-center gap-1 transition"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 p-4 bg-surface-raised border border-surface-border rounded-2xl space-y-4">
          {/* Severity */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Severity</label>
            <div className="flex flex-wrap gap-2">
              {severities.map((s) => (
                <button
                  key={s}
                  onClick={() => updateFilter({ severity: filters.severity === s ? undefined : s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                    filters.severity === s
                      ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                      : 'bg-surface-overlay text-text-secondary border-surface-border hover:border-brand-500/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Post Type */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {postTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => updateFilter({ type: filters.type === t ? undefined : t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                    filters.type === t
                      ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                      : 'bg-surface-overlay text-text-secondary border-surface-border hover:border-brand-500/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilter({ dateFrom: e.target.value || undefined })}
                className="w-full bg-surface-overlay border border-surface-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilter({ dateTo: e.target.value || undefined })}
                className="w-full bg-surface-overlay border border-surface-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

