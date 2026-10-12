import React from 'react';
import { VaultItem } from '../types/vault';
import { ShieldCheck, Key, Lock, FileText, Database } from 'lucide-react';

interface LiquidStatsProps {
  items: VaultItem[];
  lastUpdated?: number;
}

export const LiquidStats: React.FC<LiquidStatsProps> = ({ items, lastUpdated }) => {
  const credentialsCount = items.filter(i => (i.category || 'credential') === 'credential').length;
  const backupsCount = items.filter(i => i.category === 'backup').length;
  const notesCount = items.filter(i => i.category === 'note').length;

  const formatDate = (ts?: number) => {
    if (!ts) return 'In Sync';
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const statCards = [
    {
      label: 'Total Items',
      value: items.length,
      icon: Database,
      desc: 'Local zero-knowledge records'
    },
    {
      label: 'Credentials',
      value: credentialsCount,
      icon: Key,
      desc: 'Encrypted login keys'
    },
    {
      label: '2FA Backup Codes',
      value: backupsCount,
      icon: Lock,
      desc: 'Emergency recovery vaults'
    },
    {
      label: 'Secure Notes',
      value: notesCount,
      icon: FileText,
      desc: 'AES-256 protected texts'
    },
    {
      label: 'Crypto Cipher',
      value: 'AES-GCM',
      icon: ShieldCheck,
      desc: `Synced ${formatDate(lastUpdated)}`,
      isMono: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-7">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl liquid-glass transition-all duration-200 hover:border-white/20 flex flex-col justify-between ${
              idx === 4 ? 'col-span-2 md:col-span-1' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
                {stat.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-neutral-500" />
            </div>

            <div>
              <div
                className={`text-2xl font-bold text-white tracking-tight ${
                  stat.isMono ? 'font-mono text-lg' : 'font-mono tabular-nums'
                }`}
              >
                {stat.value}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 truncate">
                {stat.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
