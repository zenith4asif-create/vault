import React, { useState, useRef } from 'react';
import { VaultItem } from '../types/vault';
import { Copy, Check, Eye, EyeOff, Edit3, Trash2, Key, Shield, FileText } from 'lucide-react';
import { playLiquidClick } from '../services/audio';

interface LiquidCardProps {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (item: VaultItem) => void;
  onToast: (msg: string, type?: 'success' | 'warn' | 'error') => void;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ item, onEdit, onDelete, onToast }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | 'backup' | null>(null);
  
  // Dynamic liquid specular glare position
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const copyToClipboard = async (text: string, field: 'username' | 'password' | 'backup', label: string) => {
    playLiquidClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      onToast(`Copied ${label} to clipboard`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedField(field);
      onToast(`Copied ${label} to clipboard`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const formatDate = (ts: number) => {
    if (!ts) return '—';
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const categoryLabel = {
    credential: 'Credential',
    backup: '2FA Backup',
    note: 'Secure Note'
  }[item.category];

  const CategoryIcon = {
    credential: Key,
    backup: Shield,
    note: FileText
  }[item.category];

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl p-5 transition-all duration-300 liquid-glass hover:border-white/20 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
    >
      {/* Interactive Liquid Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.08), transparent 60%)`
        }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <div>
        <header className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Liquid icon badge */}
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 text-white/90 shadow-inner group-hover:border-white/20 transition-colors">
              <CategoryIcon className="w-4 h-4 text-white/80" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white tracking-tight truncate">
                {item.service || (item.category === 'note' ? 'Untitled Note' : 'Untitled Entry')}
              </h3>
              {/* Unboxed metadata without pills */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span>{categoryLabel}</span>
                {item.username && (
                  <>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="truncate max-w-[140px] text-neutral-400">{item.username}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                playLiquidClick();
                onEdit(item);
              }}
              title="Edit item"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playLiquidClick();
                onDelete(item);
              }}
              title="Delete item"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Card Body Rows */}
        <div className="space-y-2.5 pt-1">
          {/* Username row */}
          {item.username && item.category === 'credential' && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/20 border border-white/[0.04]">
              <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-500 pl-1 shrink-0">User</span>
              <span className="font-mono text-xs text-neutral-200 truncate flex-1 text-right select-all">
                {item.username}
              </span>
              <button
                onClick={() => copyToClipboard(item.username, 'username', 'Username')}
                title="Copy username"
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                {copiedField === 'username' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Password row */}
          {item.password && item.category === 'credential' && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/20 border border-white/[0.04]">
              <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-500 pl-1 shrink-0">Pass</span>
              <span className="font-mono text-xs text-neutral-200 truncate flex-1 text-right select-all tracking-wider">
                {showPassword ? item.password : '••••••••••••'}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => {
                    playLiquidClick();
                    setShowPassword(!showPassword);
                  }}
                  title={showPassword ? 'Hide password' : 'Reveal password'}
                  className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(item.password || '', 'password', 'Password')}
                  title="Copy password"
                  className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copiedField === 'password' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Backup codes box */}
          {item.category === 'backup' && item.backupCodes && (
            <div className="relative p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-500">Recovery Codes</span>
                <button
                  onClick={() => copyToClipboard(item.backupCodes || '', 'backup', 'Backup Codes')}
                  title="Copy all backup codes"
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedField === 'backup' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy all</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-neutral-300 whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed select-all">
                {item.backupCodes}
              </pre>
            </div>
          )}

          {/* Notes display */}
          {item.notes && (
            <div className="p-2.5 rounded-xl bg-black/25 border border-white/[0.03] text-xs text-neutral-300 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap break-words">
              {item.notes}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <footer className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 font-mono tabular-nums">
        <span>Updated {formatDate(item.updatedAt || item.createdAt)}</span>
        <span className="text-neutral-600">AES-256</span>
      </footer>
    </article>
  );
};
