'use client';

import { useState, useEffect } from 'react';
import { getSystemConfig } from './api';

/** Matches the actual backend response from /api/system/config */
export interface SystemConfig {
  paymentInstructions: {
    method: string;
    walletNumber: string;
    accountName: string;
    whatsappNumber: string;
  };
  bookingRules: {
    paymentDeadlineHours: number;
    trustPeriodHours: number;
    maxActiveBookingsPerStudent: number;
    paymentReminderHours: number[];
  };
  propertyRules: {
    maxImagesPerListing: number;
    maxImageSizeMb: number;
    allowedImageFormats: string[];
    maxDocumentSizeMb: number;
    allowedDocumentFormats: string[];
  };
  reviewRules: {
    minRating: number;
    maxRating: number;
    maxCommentLength: number;
  };
  supportContact: {
    whatsapp: string;
    email: string;
    whatsappLink: string;
  };
  genders: string[];
  listingModes: string[];
  amenitiesList: string[];
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  appVersion: {
    minimum: string;
    latest: string;
    forceUpdate: boolean;
  };
}

const DEFAULT_CONFIG: SystemConfig = {
  paymentInstructions: {
    method: 'Instapay',
    walletNumber: '',
    accountName: 'Easy Sakan',
    whatsappNumber: '+201557313819',
  },
  bookingRules: {
    paymentDeadlineHours: 48,
    trustPeriodHours: 72,
    maxActiveBookingsPerStudent: 2,
    paymentReminderHours: [12, 6, 1],
  },
  propertyRules: {
    maxImagesPerListing: 10,
    maxImageSizeMb: 5,
    allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxDocumentSizeMb: 5,
    allowedDocumentFormats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
  reviewRules: {
    minRating: 1,
    maxRating: 5,
    maxCommentLength: 1000,
  },
  supportContact: {
    whatsapp: '+201557313819',
    email: 'support@easysakan.com',
    whatsappLink: 'https://wa.me/201557313819',
  },
  genders: ['Male', 'Female', 'Any'],
  listingModes: ['Bed', 'EntireUnit'],
  amenitiesList: [
    'WiFi', 'AC', 'Elevator', 'Security', 'Parking', 'Balcony',
    'Washing Machine', 'Kitchen', 'TV', 'Heating', 'Furnished',
    'Water Heater', 'Natural Gas', 'Nearby Supermarket', 'Nearby Transport',
  ],
  termsOfServiceUrl: 'https://easysakan.com/terms',
  privacyPolicyUrl: 'https://easysakan.com/privacy',
  appVersion: {
    minimum: '1.0.0',
    latest: '1.0.0',
    forceUpdate: false,
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
          // Merge with defaults so missing nested fields still fall back
          setConfig({
            paymentInstructions: { ...DEFAULT_CONFIG.paymentInstructions, ...response.data.paymentInstructions },
            bookingRules: { ...DEFAULT_CONFIG.bookingRules, ...response.data.bookingRules },
            propertyRules: { ...DEFAULT_CONFIG.propertyRules, ...response.data.propertyRules },
            reviewRules: { ...DEFAULT_CONFIG.reviewRules, ...response.data.reviewRules },
            supportContact: { ...DEFAULT_CONFIG.supportContact, ...response.data.supportContact },
            genders: response.data.genders || DEFAULT_CONFIG.genders,
            listingModes: response.data.listingModes || DEFAULT_CONFIG.listingModes,
            amenitiesList: response.data.amenitiesList || DEFAULT_CONFIG.amenitiesList,
            termsOfServiceUrl: response.data.termsOfServiceUrl || DEFAULT_CONFIG.termsOfServiceUrl,
            privacyPolicyUrl: response.data.privacyPolicyUrl || DEFAULT_CONFIG.privacyPolicyUrl,
            appVersion: { ...DEFAULT_CONFIG.appVersion, ...response.data.appVersion },
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

export { DEFAULT_CONFIG };

