# 🏠 Easy Sakan - Property Booking Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwind-css)

**🚀 A modern, full-featured property booking platform**

**🌐 [Live Demo](https://easy-sakan.vercel.app/)** | [Features](#-features) • [Screenshots](#-screenshots) • [Getting Started](#-getting-started) • [Documentation](#-table-of-contents)

</div>

---
### Homepage & Product Listing
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-07-40.png" alt="Homepage" width="800"/>
  <p><em>Modern homepage with gradient design and featured products</em></p>
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Screenshots](#-screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Architecture](#architecture)
- [Components Documentation](#components-documentation)
- [API & Data Flow](#api--data-flow)
- [State Management](#state-management)
- [Styling Guide](#styling-guide)
- [Mock Data System](#mock-data-system)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

Easy Sakan is a modern property booking platform for discovering and reserving premium accommodations worldwide. It features complete property browsing, booking management, and user authentication.

### Key Highlights

- **Server-Side Rendering (SSR)** for optimal performance and SEO
- **Mock/Real Backend Toggle** for flexible development and testing
- **Client-Side Cart Persistence** using localStorage
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Type-Safe** with comprehensive TypeScript types
- **Modern UI** with Tailwind CSS 4 and custom gradient designs

---

## 📸 Screenshots



### Property Browsing
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-07-52.png" alt="Property Listing" width="800"/>
  <p><em>Property listing page with grid layout and filters</em></p>
</div>

### Property Details
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-08-08.png" alt="Property Details" width="800"/>
  <p><em>Property detail page with image gallery and amenities</em></p>
</div>

### Booking Options
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-08-28.png" alt="Booking Options" width="800"/>
  <p><em>Interactive booking options with dates and pricing</em></p>
</div>

### User Dashboard
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-08-41.png" alt="Dashboard" width="800"/>
  <p><em>User dashboard showing bookings and reservations</em></p>
</div>

### User Profile
<div align="center">
  <img src="../public/screenshots/Screenshot from 2025-11-23 16-08-59.png" alt="Profile" width="800"/>
  <p><em>User profile with account management</em></p>
</div>

---

## ✨ Features

### Property Management
- 🏠 Property listing with grid layout
- 🔍 Property detail pages with image galleries
- 📍 Location-based search
- 💰 Price display with best deals
- 📦 Amenities display
- ⭐ Rating and reviews system

### Booking System
- 📅 Date range selection for reservations
- ✅ Booking confirmation
- 📧 Booking notifications
- 🔄 Booking management and modifications
- 📊 Reservation history
- 📱 Fully responsive booking interface

### User Experience
- 🎭 Modern gradient-based UI design
- 🌐 Responsive navigation with mobile menu
- 🔔 Promotional banner
- 🔎 Search functionality for properties
- 💫 Smooth animations and transitions
- ⚡ Loading states and error handling
- 🎨 Consistent button system with variants

### Authentication (UI Ready)
- 📝 Sign up / Sign in pages
- 🔐 Password reset flow
- ✉️ Email verification
- 👤 User profile management
- 🚪 Account dropdown with logout

---

## 🛠 Tech Stack

### Core Framework
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety

### Styling
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **@tailwindcss/postcss 4.1.16** - PostCSS integration
- **Custom Gradients** - Blue to Indigo gradient theme

### State & Data
- **Custom React Hooks** - `useMenuState`
- **localStorage** - Client-side cart persistence
- **Custom Events** - Cross-component cart synchronization

### Authentication & Validation
- **jose 6.1.0** - JWT handling
- **zod 4.1.12** - Schema validation

### Development Tools
- **ESLint 9.39.0** - Code linting
- **pnpm** - Fast package manager

---

## 📁 Project Structure

```
store-frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   ├── dashboard/        # User dashboard
│   │   ├── profile/          # User profile
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   │
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── fonts.ts
│   │   └── layout/           # Layout components
│   │       └── Header/       # Header components
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useMenuState.ts
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── actions.ts        # Server actions
│   │   ├── api.ts            # API wrapper functions
│   │   ├── mockData.ts       # Mock API responses
│   │   ├── session.ts        # Session management
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils.ts          # Helper functions
│   │   └── validation.ts     # Form validation schemas
│   │
│   ├── store/                # Future state management
│   └── proxy.ts              # API proxy configuration
│
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdulrahman-Nasser0/store-frontend.git
   cd store-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

---

## ⚙️ Environment Setup

### Mock vs Real Backend

The project supports two modes: Mock data (for development) and Real backend (for production).

**Configuration File:** `src/lib/mock-data/config.ts`

```typescript
export const USE_MOCK_DATA = true; // Toggle between mock and real API
```

- **`true`**: Uses mock data from `src/lib/mock-data/mockData.ts`
- **`false`**: Connects to real backend API

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api.com/api

# Session Configuration
SESSION_SECRET=your-secret-key-here

# Other configurations
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🏗 Architecture

### App Router Structure

The project uses Next.js 16 App Router with the following patterns:

- **Server Components** (default): For data fetching and SEO
- **Client Components** (`"use client"`): For interactivity and state
- **Server Actions** (`"use server"`): For form submissions and mutations
- **Route Groups** (`(auth)`): For logical grouping without URL nesting

### Data Flow

```
┌─────────────────────────────────────────────────┐
│                    User Action                   │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│              Client Component                    │
│              (Product Page, Cart)                │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│              Custom Hook                         │
│        (useCart, useLaptops, useVariants)        │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│              API Layer (lib/api.ts)              │
│           Checks USE_MOCK_DATA flag              │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌──────────────────┐
│   Mock Data   │      │   Real Backend   │
│  (localStorage)│      │   (HTTP API)     │
└───────────────┘      └──────────────────┘
```

### Component Communication

The cart system uses a custom event system for cross-component synchronization:

```typescript
// Event dispatched when cart updates
window.dispatchEvent(new CustomEvent('cart-updated'));

// Components listen for updates
window.addEventListener('cart-updated', handleCartUpdate);
```

This ensures the cart icon in the header updates immediately when items are added from product pages.

---

## 📦 Components Documentation

### Common Components

#### Button Component
**Location:** `src/components/common/Button.tsx`

A versatile button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg" fullWidth>
  Add to Cart
</Button>
```

**Variants:**
- `primary`: Blue gradient background (main CTA)
- `secondary`: Glass-morphism effect
- `outline`: Border with transparent background
- `ghost`: Transparent with hover effect
- `success`: Green theme
- `danger`: Red theme

#### LoadingSpinner
**Location:** `src/components/common/LoadingSpinner.tsx`

Displays a loading animation with optional message.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}
```

**Usage:**
```tsx
<LoadingSpinner size="md" message="Loading products..." />
```

#### ErrorDisplay
**Location:** `src/components/common/ErrorDisplay.tsx`

Displays error messages with optional retry action.

**Props:**
```typescript
interface ErrorDisplayProps {
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}
```

#### EmptyState
**Location:** `src/components/common/EmptyState.tsx`

Displays empty state messages (empty cart, no products, etc.).

**Props:**
```typescript
interface EmptyStateProps {
  icon: 'box' | 'cart' | 'search';
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}
```

### Layout Components

#### Header
**Location:** `src/components/layout/Header/`

The main navigation header with multiple sub-components:

**Components:**
- `Header.tsx`: Main header wrapper
- `Logo.tsx`: Brand logo with gradient
- `DesktopNavigation.tsx`: Desktop menu links
- `MobileMenu.tsx`: Mobile hamburger menu
- `SearchBar.tsx`: Search input
- `CartIconClient.tsx`: Cart with item count badge
- `AccountDropdown.tsx`: User account menu
- `UserActions.tsx`: Authentication buttons
- `PromotionalBanner.tsx`: Top banner

**Features:**
- Sticky positioning
- Backdrop blur effect
- Responsive design
- Cart count updates in real-time
- Authentication state-aware UI

#### CartIcon
**Location:** `src/components/layout/Header/CartIcon.tsx`

Displays cart icon with red badge showing item count.

**Props:**
```typescript
interface CartIconProps {
  itemCount?: number; // Default: 0
}
```

**Features:**
- Always visible badge (shows "0" when empty)
- Red background (`bg-red-500`)
- Displays up to "99+"
- Scale animation on hover

### Product Components

#### LaptopCard
**Location:** `src/components/products/LaptopCard.tsx`

Displays individual laptop in grid view.

**Props:**
```typescript
interface LaptopCardProps {
  laptop: Laptop;
}
```

**Features:**
- Product image with fallback
- Brand and model name
- Base price display
- Discount percentage badge
- Variant count
- Stock status indicator
- Hover effects

#### LaptopsGrid
**Location:** `src/components/products/LaptopsGrid.tsx`

Grid layout for laptop cards with loading and error states.

**Props:**
```typescript
interface LaptopsGridProps {
  laptops: Laptop[];
  loading?: boolean;
  error?: string | null;
}
```

#### LaptopVariantsClient
**Location:** `src/components/products/LaptopVariantsClient.tsx`

Client component for selecting and purchasing laptop variants.

**Props:**
```typescript
interface LaptopVariantsClientProps {
  laptopId: number;
  token?: string | null;
}
```

**Features:**
- Auto-selects first available variant
- Variant selector integration
- Add to cart functionality
- Stock availability checking
- Price display with discounts
- Success/error message display

#### VariantSelector
**Location:** `src/components/products/VariantSelector.tsx`

Interactive variant selection grid.

**Props:**
```typescript
interface VariantSelectorProps {
  variants: LaptopVariantDetailed[];
  selectedVariant: LaptopVariantDetailed | null;
  onVariantSelect: (variant: LaptopVariantDetailed) => void;
}
```

**Features:**
- Grid layout for variant options
- Highlights selected variant
- Shows availability status
- Displays price and discount
- Disables out-of-stock variants

#### ProductImageGallery
**Location:** `src/components/products/ProductImageGallery.tsx`

Image gallery with thumbnail navigation.

**Props:**
```typescript
interface ProductImageGalleryProps {
  images: LaptopImage[];
  productName: string;
}
```

---

## 🔌 API & Data Flow

### API Wrapper
**Location:** `src/lib/api.ts`

Centralized API functions that handle both mock and real data.

#### Laptop APIs

```typescript
// Get paginated laptops
getLaptops(page: number, pageSize: number, token?: string): Promise<ApiResponse<PaginatedResponse<Laptop>>>

// Get single laptop by ID
getLaptopById(id: number, token?: string): Promise<ApiResponse<Laptop>>

// Get laptop variants
getLaptopVariants(laptopId: number, page: number, pageSize: number, token?: string): Promise<ApiResponse<PaginatedResponse<LaptopVariantDetailed>>>
```

#### Cart APIs

```typescript
// Get user's cart
getCart(token?: string): Promise<ApiResponse<CartData>>

// Add item to cart
addToCart(request: AddToCartRequest, token?: string): Promise<ApiResponse<AddToCartResponse>>

// Update cart item quantity
updateCartItem(itemId: number, request: UpdateCartItemRequest, token?: string): Promise<ApiResponse<CartItem>>

// Remove item from cart
removeCartItem(itemId: number, token?: string): Promise<ApiResponse<{ removedItemId: number }>>

// Clear entire cart
clearCart(token?: string): Promise<ApiResponse<{ itemsRemoved: number }>>
```

### Response Format

All API functions return a standardized response:

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  statusCode?: number;
}
```

---

## 🎣 Custom Hooks

### useCart Hook
**Location:** `src/hooks/useCart.ts`

Manages cart state and operations.

**Usage:**
```typescript
const { cart, loading, error, addItem, updateItem, removeItem, clearAllItems, fetchCart } = useCart();
```

**Returns:**
```typescript
{
  cart: CartData | null;              // Current cart data
  loading: boolean;                    // Loading state
  error: string | null;                // Error message
  fetchCart: () => Promise<void>;      // Refresh cart
  addItem: (request: AddToCartRequest) => Promise<{ success: boolean; message: string }>;
  updateItem: (itemId: number, quantity: number) => Promise<{ success: boolean; message: string }>;
  removeItem: (itemId: number) => Promise<{ success: boolean; message: string }>;
  clearAllItems: () => Promise<{ success: boolean; message: string }>;
}
```

**Features:**
- Automatic cart fetching on mount
- Cross-component synchronization via custom events
- Mock/real backend switching
- Error handling
- Loading states

### useLaptops Hook
**Location:** `src/hooks/useLaptops.ts`

Fetches and manages laptop listings.

**Usage:**
```typescript
const { laptops, loading, error, hasMore, loadMore, refetch } = useLaptops({
  initialPage: 1,
  pageSize: 12,
  token: null
});
```

**Returns:**
```typescript
{
  laptops: Laptop[];                   // Array of laptops
  loading: boolean;                    // Loading state
  error: string | null;                // Error message
  hasMore: boolean;                    // More pages available
  loadMore: () => Promise<void>;       // Load next page
  refetch: () => Promise<void>;        // Refresh data
}
```

### useVariants Hook
**Location:** `src/hooks/useVariants.ts`

Fetches laptop variants for a specific product.

**Usage:**
```typescript
const { variants, loading, error, refetch } = useVariants({
  laptopId: 1,
  pageSize: 20,
  token: null
});
```

**Returns:**
```typescript
{
  variants: LaptopVariantDetailed[];   // Array of variants
  loading: boolean;                    // Loading state
  error: string | null;                // Error message
  refetch: () => Promise<void>;        // Refresh data
}
```

### useMenuState Hook
**Location:** `src/hooks/useMenuState.ts`

Simple state management for mobile menu.

**Usage:**
```typescript
const [isOpen, toggle, setIsOpen] = useMenuState();
```

---

## 🎨 Styling Guide

### Design System

#### Colors
- **Primary**: Blue (`#2563EB`) to Indigo (`#4F46E5`) gradient
- **Success**: Green (`#10B981`)
- **Danger**: Red (`#EF4444`)
- **Warning**: Yellow (`#F59E0B`)
- **Neutral**: Gray scale

#### Typography
- **Font Family**: Inter (via `next/font/google`)
- **Headings**: Bold, darker gray
- **Body**: Regular, medium gray
- **Small**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **Large**: 1.125rem (18px)

#### Spacing
Follows Tailwind's default spacing scale (0.25rem increments).

#### Border Radius
- **Small**: 0.5rem (8px) - `rounded-lg`
- **Medium**: 0.75rem (12px) - `rounded-xl`
- **Large**: 1rem (16px) - `rounded-2xl`

### Common Patterns

#### Gradient Background
```tsx
className="bg-linear-to-r from-blue-600 to-indigo-600"
```

#### Glass Morphism
```tsx
className="bg-white/10 backdrop-blur-md"
```

#### Card Style
```tsx
className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
```

#### Responsive Layout
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## 🗄️ Mock Data System

### Configuration
**Location:** `src/lib/mock-data/config.ts`

```typescript
export const USE_MOCK_DATA = true;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 5000,
};

export const ITEMS_PER_PAGE = 12;
```

### Mock Data
**Location:** `src/lib/mock-data/mockData.ts`

Contains mock data for:
- **Laptops** (50+ mock laptops with brands, specs, images)
- **Variants** (Multiple RAM/Storage configurations per laptop)
- **Cart Items** (Server-side mock - not used, replaced by localStorage)

### Mock Functions

```typescript
// Get paginated laptops
getMockLaptops(page: number, pageSize: number): PaginatedResponse<Laptop>

// Get single laptop
getMockLaptopById(id: number): Laptop | null

// Get laptop variants
getMockLaptopVariants(laptopId: number, page: number, pageSize: number): VariantsResponse
```

---

## 🛒 Cart System

### Architecture

The cart system uses **client-side localStorage** for persistence in mock mode.

### Client Cart Storage
**Location:** `src/lib/clientCartStorage.ts`

#### Key Functions

```typescript
// Get cart from localStorage
getClientCart(): CartData

// Add item to cart
addClientCartItem(
  productId: number,
  productName: string,
  sku: string,
  unitPrice: number,
  discountAmount: number,
  stockAvailable: number,
  image: string,
  quantity: number
): AddToCartResponse

// Update cart item quantity
updateClientCartItem(itemId: number, quantity: number): void

// Remove item from cart
removeClientCartItem(itemId: number): { removedItemId: number; cartSummary: CartSummary }

// Clear entire cart
clearClientCart(): { itemsRemoved: number; clearedAt: string }
```

### Cart Data Structure

```typescript
interface CartData {
  items: CartItem[];
  totalItems: number;      // Total quantity of all items
  subtotal: number;        // Sum of all item prices
  discount: number;        // Total discount amount
  tax: number;            // Tax amount (currently 0)
  shipping: number;       // Shipping cost (currently 0 - FREE)
  total: number;          // Final total
  appliedDiscountCode: string | null;
}

interface CartItem {
  id: number;             // Unique cart item ID
  productType: string;    // 'LaptopVariant'
  productId: number;      // Variant ID
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;     // unitPrice * quantity
  stockAvailable: number;
  image: string;
  addedAt: string;        // ISO timestamp
}
```

### Stock Validation

The cart system enforces stock limits:

1. **Adding to cart**: Validates quantity doesn't exceed available stock
2. **Updating quantity**: Validates new quantity doesn't exceed stock
3. **Existing items**: Checks total quantity when adding more of same item

```typescript
// Example validation
if (newQuantity > stockAvailable) {
  throw new Error(`Only ${stockAvailable} items available in stock`);
}
```

### Cross-Component Synchronization

Cart updates trigger a custom event:

```typescript
// Dispatched after cart operations
window.dispatchEvent(new CustomEvent('cart-updated'));

// Listened to by cart icon and other components
window.addEventListener('cart-updated', () => {
  fetchCart(); // Refresh cart data
});
```

---

## 🔐 Authentication

### Current Status
Authentication UI is complete and ready. Backend integration is pending.

### Components
- Login page (`/login`)
- Signup page (`/signup`)
- Forgot password page (`/forgot-password`)
- Email verification page (`/verify-email`)

### Session Management
**Location:** `src/lib/session.ts`

Uses JWT tokens with `jose` library:

```typescript
// Create session
async function createSession(payload: SessionPayload): Promise<string>

// Get session from cookies
async function getSession(): Promise<SessionPayload | null>

// Delete session
async function deleteSession(): Promise<void>
```

### Server Actions
**Location:** `src/lib/actions.ts`

```typescript
// Login action
async function login(prevState: any, formData: FormData): Promise<LoginState>

// Signup action
async function signup(prevState: any, formData: FormData): Promise<SignUpState>

// Logout action
async function logout(): Promise<void>

// Get session token (client-accessible)
async function getSessionToken(): Promise<string | null>
```

### Validation
**Location:** `src/lib/validation.ts`

Uses Zod for form validation:

```typescript
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SignUpSchema = z.object({
  userName: z.string().min(3),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword);
```

### Protected Routes

To protect routes, check authentication in layout or page:

```typescript
// In layout.tsx or page.tsx
const session = await getSession();
if (!session) {
  redirect('/login');
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel auto-detects Next.js configuration

2. **Environment Variables**
   Add required environment variables in Vercel dashboard:
   ```
   SESSION_SECRET=your-secret-key
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Build Settings**
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

4. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Preview deployments for pull requests

### Build Considerations

- Ensure `pnpm-lock.yaml` is committed and up-to-date
- Set `USE_MOCK_DATA = false` for production builds
- Configure proper API base URL
- Set secure SESSION_SECRET

### Performance Optimizations

The project includes several optimizations:
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Server Components**: Default for optimal performance
- **Font Optimization**: `next/font` for Inter font
- **CSS Optimization**: Tailwind CSS purging

---

## 📝 Type System

### Core Types
**Location:** `src/lib/types.ts`

#### Product Types

```typescript
interface Laptop {
  id: number;
  modelName: string;
  brandId: number;
  brandName: string;
  brandLogo: string;
  categoryId: number;
  categoryName: string;
  processorBrand: string;
  processorModel: string;
  graphicsCard: string;
  displaySize: number;
  displayResolution: string;
  basePrice: number;
  mainImage: string | null;
  variantCount: number;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  averageRating: number;
  reviewCount: number;
}

interface LaptopVariantDetailed {
  id: number;
  sku: string;
  ram: number;
  storage: number;
  storageType: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  discountAmount?: number;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  stockStatus: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

#### Cart Types

```typescript
interface CartItem {
  id: number;
  productType: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
  stockAvailable: number;
  image: string;
  addedAt: string;
}

interface CartData {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  appliedDiscountCode: string | null;
}
```

#### API Types

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## 🔧 Utility Functions

### Price Formatting
**Location:** `src/lib/utils.ts`

```typescript
// Format number as USD currency
formatPrice(amount: number): string
// Example: formatPrice(1299.99) → "$1,299.99"

// Calculate discount percentage
calculateDiscountPercentage(originalPrice: number, currentPrice: number): number
// Example: calculateDiscountPercentage(1500, 1299) → 13

// Calculate discount amount
calculateDiscountAmount(originalPrice: number, currentPrice: number): number
// Example: calculateDiscountAmount(1500, 1299) → 201
```

### Stock Management

```typescript
// Check if variant is available for purchase
isVariantAvailable(stockStatus: string, availableQuantity: number, isActive: boolean): boolean

// Get stock status label
getStockStatusLabel(stockStatus: string): string
// Returns: "In Stock", "Low Stock", "Out of Stock", etc.

// Get stock badge colors
getStockBadgeColor(stockStatus: string): { bg: string; text: string; border: string }
```

### Storage Formatting

```typescript
// Format storage size
formatStorage(storage: number): string
// Example: formatStorage(512) → "512GB"
// Example: formatStorage(1024) → "1TB"

// Format RAM size
formatRAM(ram: number): string
// Example: formatRAM(16) → "16GB RAM"
```

---

## 🐛 Common Issues & Solutions

### Issue: Cart not persisting
**Solution:** Ensure `USE_MOCK_DATA = true` in `config.ts` and localStorage is enabled in browser.

### Issue: Build fails with lockfile error
**Solution:** Run `pnpm install` to update `pnpm-lock.yaml`, then commit both files.

### Issue: Images not loading
**Solution:** Check image paths start with `/` and files exist in `public/` directory.

### Issue: Cart count not updating
**Solution:** Ensure `CartIconClient` is being used and custom event system is working.

### Issue: TypeScript errors
**Solution:** Run `pnpm build` to see all type errors. Check `tsconfig.json` is configured correctly.

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Product search with filters
- [ ] Product comparison
- [ ] Wishlist functionality
- [ ] User reviews and ratings
- [ ] Order history
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Analytics integration

### Backend Integration Checklist
- [ ] Connect authentication APIs
- [ ] Implement real cart sync
- [ ] Add order processing
- [ ] Set up payment gateway
- [ ] Configure email service
- [ ] Add user profile management

---

## 📚 Resources

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Related Projects
- Backend API repository: [TechZone Backend](https://github.com/3bdalrhmanS3d/TechZone) (C# .NET)
- Flutter Mobile App: Coming soon

---

## 👥 Team

### Frontend Team
- **Frontend Developer:** Abdulrahman Nasser - [@Abdulrahman-Nasser0](https://github.com/Abdulrahman-Nasser0)
  - Next.js / React development
  - UI/UX implementation
  - State management & API integration

### Backend Team
- **Backend Developers:** .NET team
  - Repository: [TechZone Backend](https://github.com/3bdalrhmanS3d/TechZone)
  - RESTful API development

### Mobile Team
- **Flutter Developers:** Flutter team
  - Cross-platform mobile app development

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add types for new functions
   - Update documentation

3. **Test your changes**
   - Test in development mode
   - Test responsive design
   - Check for TypeScript errors

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: Add product comparison feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use TypeScript for all new files
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use Tailwind CSS classes (avoid custom CSS)
- Keep components small and focused
- Extract reusable logic to hooks
- Use proper semantic HTML

---

## 📄 License

This project is private and proprietary.

---

## 📧 Contact

**Frontend Developer:** Abdulrahman Nasser  
**GitHub:** [@Abdulrahman-Nasser0](https://github.com/Abdulrahman-Nasser0)  
**Frontend Repository:** [store-frontend](https://github.com/Abdulrahman-Nasser0/store-frontend)  
**Backend Repository:** [TechZone Backend](https://github.com/3bdalrhmanS3d/TechZone)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vercel for hosting and deployment
- React team for React 19

---

**Last Updated:** November 23, 2025
**Version:** 0.1.0
