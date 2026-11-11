/**
 * Moltworker Configuration
 * Manages connection settings for Cloudflare moltworker API
 */

export interface MoltworkerConfig {
  url: string;
  token: string;
  cdpSecret?: string;
}

// Default configuration - will be overridden by environment variables or user settings
export const defaultConfig: MoltworkerConfig = {
  url: import.meta.env.VITE_MOLTWORKER_URL || '',
  token: import.meta.env.VITE_MOLTWORKER_TOKEN || '',
  cdpSecret: import.meta.env.VITE_MOLTWORKER_CDP_SECRET || '',
};

/**
 * Get the current moltworker configuration
 * Checks localStorage first, then environment variables, then defaults
 */
export const getMoltworkerConfig = (): MoltworkerConfig => {
  const stored = localStorage.getItem('moltworker_config');
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) };
    } catch {
      // Invalid JSON, use defaults
    }
  }
  return defaultConfig;
};

/**
 * Save moltworker configuration to localStorage
 */
export const saveMoltworkerConfig = (config: Partial<MoltworkerConfig>): void => {
  const current = getMoltworkerConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('moltworker_config', JSON.stringify(updated));
};

/**
 * Check if moltworker is properly configured
 */
export const isMoltworkerConfigured = (): boolean => {
  const config = getMoltworkerConfig();
  return !!config.url && !!config.token;
};

/**
 * Build URL with authentication token
 */
export const buildAuthUrl = (endpoint: string, config?: MoltworkerConfig): string => {
  const cfg = config || getMoltworkerConfig();
  const url = new URL(endpoint, cfg.url);
  url.searchParams.set('token', cfg.token);
  return url.toString();
};

/**
 * Build debug URL with secret (for /debug/* routes)
 */
export const buildDebugUrl = (endpoint: string, config?: MoltworkerConfig): string => {
  const cfg = config || getMoltworkerConfig();
  if (!cfg.cdpSecret) {
    throw new Error('CDP_SECRET is required for debug endpoints');
  }
  const url = new URL(endpoint, cfg.url);
  url.searchParams.set('secret', cfg.cdpSecret);
  return url.toString();
};

/**
 * Build WebSocket URL with token
 */
export const buildWebSocketUrl = (path: string = '/ws', config?: MoltworkerConfig): string => {
  const cfg = config || getMoltworkerConfig();
  const url = new URL(path, cfg.url);
  // Convert http(s) to ws(s)
  const wsProtocol = cfg.url.startsWith('https') ? 'wss:' : 'ws:';
  url.protocol = wsProtocol;
  url.searchParams.set('token', cfg.token);
  return url.toString();
};
