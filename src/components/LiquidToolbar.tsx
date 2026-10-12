import React from 'react';
import { Search, Plus, KeyRound } from 'lucide-react';
import { VaultCategory } from '../types/vault';
import { playLiquidClick } from '../services/audio';

interface LiquidToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: 'all' | VaultCategory;
  onFilterChange: (filter: 'all' | VaultCategory) => void;
  onAddItem: () => void;
  onQuickGenerate: () => void;
}

export const LiquidToolbar: React.FC<LiquidToolbarProps> = ({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onAddItem,
  onQuickGenerate
}) => {
  const filterOptions: Array<{ id: 'all' | VaultCategory; label: string }> = [
    { id: 'all', label: 'All Items' },
    { id: 'credential', label: 'Credentials' },
    { id: 'backup', label: 'Backup Codes' },
    { id: 'note', label: 'Secure Notes' }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by service, username, or note contents..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm liquid-glass-input placeholder:text-neutral-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white cursor-pointer px-1.5 py-0.5 rounded bg-white/10"
          >
            Clear
          </button>
        )}
      </div>

      {/* Segmented Filter Control & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
        {/* Interactive Segmented Filter (Allowed interactive buttons) */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                playLiquidClick();
                onFilterChange(opt.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                activeFilter === opt.id
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Quick Generator */}
        <button
          onClick={() => {
            playLiquidClick();
            onQuickGenerate();
          }}
          title="Generate secure password"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl liquid-btn-ghost cursor-pointer whitespace-nowrap"
        >
          <KeyRound className="w-3.5 h-3.5 text-neutral-300" />
          <span>Generator</span>
        </button>

        {/* Primary Add Item Button */}
        <button
          onClick={() => {
            playLiquidClick();
            onAddItem();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl liquid-btn-primary cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>
    </div>
  );
};
