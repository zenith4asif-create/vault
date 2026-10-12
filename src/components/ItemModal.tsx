import React, { useState, useEffect } from 'react';
import { VaultItem, VaultCategory } from '../types/vault';
import { X, RefreshCw, Eye, EyeOff, Key, Shield, FileText, Check } from 'lucide-react';
import { generatePassword, evaluatePasswordStrength } from '../services/crypto';
import { playLiquidClick } from '../services/audio';

interface ItemModalProps {
  isOpen: boolean;
  item: VaultItem | null;
  onClose: () => void;
  onSave: (itemData: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, item, onClose, onSave }) => {
  const [category, setCategory] = useState<VaultCategory>('credential');
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setCategory(item.category || 'credential');
      setService(item.service || '');
      setUsername(item.username || '');
      setPassword(item.password || '');
      setBackupCodes(item.backupCodes || '');
      setNotes(item.notes || '');
    } else {
      setCategory('credential');
      setService('');
      setUsername('');
      setPassword('');
      setBackupCodes('');
      setNotes('');
    }
    setError('');
    setShowPassword(false);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(password);

  const handleGenerate = () => {
    playLiquidClick();
    const generated = generatePassword(20);
    setPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category !== 'note' && !service.trim()) {
      setError('Please provide a service or account name.');
      return;
    }
    if (category === 'note' && !notes.trim()) {
      setError('Note content cannot be empty.');
      return;
    }

    onSave({
      category,
      service: service.trim(),
      username: username.trim(),
      password,
      backupCodes: backupCodes.trim(),
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg p-6 sm:p-7 rounded-3xl liquid-glass-elevated border border-white/20 text-neutral-100 shadow-2xl relative my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {item ? 'Modify Vault Entry' : 'Store New Encrypted Item'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Client-side encrypted with AES-256-GCM before saving.
            </p>
          </div>
          <button
            onClick={() => {
              playLiquidClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Item Classification
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  playLiquidClick();
                  setCategory('credential');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  category === 'credential'
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Credential</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playLiquidClick();
                  setCategory('backup');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  category === 'backup'
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>2FA Backup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playLiquidClick();
                  setCategory('note');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  category === 'note'
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Secure Note</span>
              </button>
            </div>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Service / Resource Name {category !== 'note' && <span className="text-white">*</span>}
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. GitHub, Google Cloud, ProtonMail, Banking"
              required={category !== 'note'}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm liquid-glass-input placeholder:text-neutral-500"
            />
          </div>

          {/* Username / Email */}
          {category === 'credential' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Username / Email Address
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@domain.com or account handle"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm liquid-glass-input placeholder:text-neutral-500"
              />
            </div>
          )}

          {/* Password Field */}
          {category === 'credential' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate strong</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl text-sm font-mono liquid-glass-input placeholder:text-neutral-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playLiquidClick();
                      setShowPassword(!showPassword);
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden border border-white/10 p-[0.5px]">
                    <div
                      className="h-full bg-gradient-to-r from-white/40 to-white rounded-full transition-all duration-300"
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>Entropy: {strength.label}</span>
                    <span className="tabular-nums">{Math.round(strength.percent)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Backup codes */}
          {category === 'backup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Recovery / 2FA Backup Codes
              </label>
              <textarea
                value={backupCodes}
                onChange={(e) => setBackupCodes(e.target.value)}
                placeholder="Paste backup codes (one per line, e.g. 8493-2940)..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono liquid-glass-input placeholder:text-neutral-500 leading-relaxed resize-y"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Secure Notes {category === 'note' && <span className="text-white">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private instructions, security questions, or notes..."
              rows={category === 'note' ? 5 : 2}
              required={category === 'note'}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs liquid-glass-input placeholder:text-neutral-500 leading-relaxed resize-y"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                playLiquidClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium liquid-btn-ghost cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold liquid-btn-primary cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{item ? 'Save Modifications' : 'Encrypt & Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
