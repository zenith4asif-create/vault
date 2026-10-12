export type VaultCategory = 'credential' | 'backup' | 'note';

export interface VaultItem {
  id: string;
  category: VaultCategory;
  service: string;
  username: string;
  password?: string;
  backupCodes?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface VaultBlob {
  version: number;
  salt: string;        // base64
  iv: string;          // base64
  ciphertext: string;  // base64
  updatedAt: number;
}

export interface VaultMetadata {
  salt: string;
  updatedAt?: number;
}

export type ViewState = 'login' | 'unlock' | 'dashboard';
