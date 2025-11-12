import type { BaseEntity } from '../common/base';

export interface LoginActivity extends BaseEntity {
  ip: string;
  device: string;
  browser: string;
  loggedAt: string;
  status: 'success' | 'failed';
  userId: string;
}

export interface UserActivityStats {
  totalLogins: number;
  lastLogin: string;
  devices: Array<{
    device: string;
    count: number;
    lastUsed: string;
  }>;
  browsers: Array<{
    browser: string;
    count: number;
    lastUsed: string;
  }>;
}
