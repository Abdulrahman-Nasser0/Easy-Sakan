/**
 * Utility functions for the application
 * Following the project's patterns for consistency
 */

/**
 * Format a number as currency (USD)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,299.99")
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate discount percentage between two prices
 * @param originalPrice - The original price
 * @param currentPrice - The current/sale price
 * @returns Discount percentage (rounded to nearest integer)
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Calculate discount amount between two prices
 * @param originalPrice - The original price
 * @param currentPrice - The current/sale price
 * @returns Discount amount
 */
export function calculateDiscountAmount(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
  return originalPrice - currentPrice;
}

/**
 * Get Tailwind color classes for stock status badges
 * @param stockStatus - The stock status string
 * @returns Object with background and text color classes
 */
export function getStockBadgeColor(stockStatus: string): {
  bg: string;
  text: string;
  border: string;
} {
  const status = stockStatus.toLowerCase();

  switch (status) {
    case 'instock':
    case 'in stock':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      };
    case 'lowstock':
    case 'low stock':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      };
    case 'outofstock':
    case 'out of stock':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      };
    case 'preorder':
    case 'pre-order':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      };
  }
}

/**
 * Get human-readable stock status label
 * @param stockStatus - The stock status string
 * @returns Human-readable label
 */
export function getStockStatusLabel(stockStatus: string): string {
  const status = stockStatus.toLowerCase().replace(/\s+/g, '');

  const labels: Record<string, string> = {
    instock: 'In Stock',
    lowstock: 'Low Stock',
    outofstock: 'Out of Stock',
    preorder: 'Pre-Order',
    discontinued: 'Discontinued',
  };

  return labels[status] || stockStatus;
}

/**
 * Check if a variant is available for purchase
 * @param stockStatus - The stock status string
 * @param availableQuantity - The available quantity
 * @param isActive - Whether the variant is active
 * @returns True if the variant can be purchased
 */
export function isVariantAvailable(
  stockStatus: string,
  availableQuantity: number,
  isActive: boolean = true
): boolean {
  if (!isActive) return false;

  const status = stockStatus.toLowerCase().replace(/\s+/g, '');
  return (status === 'instock' || status === 'lowstock') && availableQuantity > 0;
}

/**
 * Format storage size with proper units
 * @param storage - Storage size in GB
 * @returns Formatted storage string (e.g., "512GB" or "1TB")
 */
export function formatStorage(storage: number): string {
  if (storage >= 1024) {
    const tb = storage / 1024;
    return `${tb % 1 === 0 ? tb : tb.toFixed(1)}TB`;
  }
  return `${storage}GB`;
}

/**
 * Format RAM size
 * @param ram - RAM size in GB
 * @returns Formatted RAM string (e.g., "16GB RAM")
 */
export function formatRAM(ram: number): string {
  return `${ram}GB RAM`;
}

/**
 * Get discount badge color based on percentage
 * @param discountPercentage - The discount percentage
 * @returns Tailwind color classes
 */
export function getDiscountBadgeColor(discountPercentage: number): {
  bg: string;
  text: string;
} {
  if (discountPercentage >= 30) {
    return { bg: 'bg-red-500', text: 'text-white' };
  } else if (discountPercentage >= 20) {
    return { bg: 'bg-orange-500', text: 'text-white' };
  } else if (discountPercentage >= 10) {
    return { bg: 'bg-yellow-500', text: 'text-white' };
  } else {
    return { bg: 'bg-blue-500', text: 'text-white' };
  }
}

/**
 * Get full image URL, prepending backend API URL if necessary
 * @param imagePath - The relative or absolute image path
 * @returns Full URL to the image
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

