/**
 * Moltworker API Client
 * Interfaces with Cloudflare moltworker endpoints
 */

import { buildAuthUrl, buildDebugUrl, getMoltworkerConfig } from '../config';

// ===== Types =====

export interface MoltworkerVersion {
  container: string;
  moltbot: string;
  openclaw: string;
}

export interface MoltworkerProcess {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu?: number;
  memory?: number;
  uptime?: number;
  createdAt?: string;
}

export interface MoltworkerLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
}

export interface MoltworkerSystemHealth {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percent: number;
  };
  disk: {
    used: number;
    total: number;
    percent: number;
  };
  uptime: number;
}

export interface MoltworkerErrorResponse {
  error: string;
  message?: string;
}

// ===== API Client =====

class MoltworkerAPI {
  private config = getMoltworkerConfig();

  /**
   * Fetch with error handling
   */
  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error: MoltworkerErrorResponse = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.message || error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Get version information
   * GET /debug/version
   */
  async getVersion(): Promise<MoltworkerVersion> {
    this.config = getMoltworkerConfig();
    const url = buildDebugUrl('/debug/version');
    return this.fetch<MoltworkerVersion>(url);
  }

  /**
   * Get list of running processes
   * GET /debug/processes
   */
  async getProcesses(): Promise<MoltworkerProcess[]> {
    this.config = getMoltworkerConfig();
    const url = buildDebugUrl('/debug/processes');
    return this.fetch<MoltworkerProcess[]>(url);
  }

  /**
   * Get logs for a specific process
   * GET /debug/logs?id=<process_id>
   */
  async getLogs(processId: string, limit: number = 100): Promise<MoltworkerLogEntry[]> {
    this.config = getMoltworkerConfig();
    const url = buildDebugUrl(`/debug/logs?id=${encodeURIComponent(processId)}&limit=${limit}`);
    return this.fetch<MoltworkerLogEntry[]>(url);
  }

  /**
   * Get system health metrics
   * Derived from process information
   */
  async getSystemHealth(): Promise<MoltworkerSystemHealth> {
    this.config = getMoltworkerConfig();
    const processes = await this.getProcesses();

    // Calculate aggregate metrics
    const totalCpu = processes.reduce((sum, p) => sum + (p.cpu || 0), 0);
    const totalMemory = processes.reduce((sum, p) => sum + (p.memory || 0), 0);

    // These are approximations - real implementation would get actual container metrics
    const memoryTotal = 4096; // 4GB default for standard-1 container
    const diskTotal = 8192; // 8GB default disk

    return {
      cpu: Math.min(100, totalCpu),
      memory: {
        used: totalMemory,
        total: memoryTotal,
        percent: (totalMemory / memoryTotal) * 100,
      },
      disk: {
        used: diskTotal * 0.5, // Placeholder - would come from actual metrics
        total: diskTotal,
        percent: 50,
      },
      uptime: processes[0]?.uptime || 0,
    };
  }

  /**
   * Restart the gateway process
   * POST /_admin/api/restart (requires Cloudflare Access)
   */
  async restartGateway(): Promise<{ success: boolean; message: string }> {
    this.config = getMoltworkerConfig();
    const url = new URL('/_admin/api/restart', this.config.url).toString();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to restart gateway');
    }
  }

  /**
   * Trigger R2 backup
   * POST /_admin/api/backup (requires Cloudflare Access)
   */
  async triggerBackup(): Promise<{ success: boolean; message: string }> {
    this.config = getMoltworkerConfig();
    const url = new URL('/_admin/api/backup', this.config.url).toString();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to trigger backup');
    }
  }

  /**
   * Get paired devices
   * GET /_admin/api/devices (requires Cloudflare Access)
   */
  async getPairedDevices(): Promise<any[]> {
    this.config = getMoltworkerConfig();
    const url = new URL('/_admin/api/devices', this.config.url).toString();

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get paired devices');
    }
  }
}

// Export singleton instance
export const moltworkerAPI = new MoltworkerAPI();
