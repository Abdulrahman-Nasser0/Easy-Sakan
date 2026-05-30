'use client';

import { useState, useEffect } from 'react';
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

export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getSystemConfig();
        if (response.isSuccess && response.data) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...response.data,
          });
        }
      } catch (err) {
        console.error('Error fetching system config:', err);
        setError('Failed to load system configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}

export function useSystemConfigValue<T extends keyof SystemConfig>(key: T): SystemConfig[T] {
  const { config } = useSystemConfig();
  return config[key];
}

export { DEFAULT_CONFIG };
export type { SystemConfig };
