import "server-only";
import { getSystemConfig } from './api';

interface SystemConfig {
  platformFee: number;
  currency: string;
  supportedLocales: string[];
  maxPropertyImages: number;
  bookingPaymentTimeoutHours: number;
  trustPeriodHours: number;
  minDescriptionLength: number;
  amenitiesList: string[];
  universities: string[];
  pricePerSqmRange: {
    min: number;
    max: number;
  };
}

const DEFAULT_CONFIG: SystemConfig = {
  platformFee: 0,
  currency: 'EGP',
  supportedLocales: ['en'],
  maxPropertyImages: 10,
  bookingPaymentTimeoutHours: 48,
  trustPeriodHours: 72,
  minDescriptionLength: 20,
  amenitiesList: ['WiFi', 'AC', 'Elevator', 'Security', 'Parking', 'Balcony', 'Kitchen', 'Furnished'],
  universities: [],
  pricePerSqmRange: {
    min: 200,
    max: 2000,
  },
};

let cachedConfig: SystemConfig | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches the system configuration from the API, with caching.
 * Falls back to defaults if the API is unavailable.
 * Can be used in server components (marked with 'server-only').
 */
export async function fetchSystemConfig(): Promise<SystemConfig> {
  // Return cached config if still fresh
  if (cachedConfig && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const response = await getSystemConfig();
    if (response.isSuccess && response.data) {
      cachedConfig = {
        ...DEFAULT_CONFIG,
        ...response.data,
      };
      lastFetchTime = Date.now();
      return cachedConfig;
    }
  } catch (err) {
    console.error('Error fetching system config:', err);
  }

  return DEFAULT_CONFIG;
}

/**
 * Clears the cached system config (useful after config updates).
 */
export function clearSystemConfigCache() {
  cachedConfig = null;
  lastFetchTime = 0;
}

export { DEFAULT_CONFIG };
export type { SystemConfig };
