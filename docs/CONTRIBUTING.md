# Contributing to Easy Sakan

Thank you for considering contributing to Easy Sakan! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Standards](#project-standards)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Process](#code-review-process)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the project
- Show empathy towards other contributors

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher
- pnpm 8.x or higher
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/store-frontend.git
   cd store-frontend
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/Abdulrahman-Nasser0/store-frontend.git
   ```

---

## Development Setup

### Initial Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Development Tools

- **ESLint:** `pnpm lint`
- **Type checking:** `pnpm build` (checks types during build)
- **Format check:** Follow existing code formatting

---

## Project Standards

### File Structure

- Place components in appropriate directories:
  - `src/components/common/` - Reusable UI components
  - `src/components/layout/` - Layout-specific components
  - `src/components/products/` - Product-related components
  
- Place hooks in `src/hooks/`
- Place utilities in `src/lib/`
- Place types in `src/lib/types.ts`

### Naming Conventions

#### Files
- **Components:** PascalCase (e.g., `Button.tsx`, `ProductCard.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useCart.ts`)
- **Utilities:** camelCase (e.g., `formatPrice.ts`)
- **Types:** PascalCase (e.g., `types.ts`)

#### Code
- **Components:** PascalCase (e.g., `const Button = () => {}`)
- **Functions:** camelCase (e.g., `function formatPrice()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `const API_BASE_URL`)
- **Interfaces:** PascalCase (e.g., `interface CartItem {}`)
- **Types:** PascalCase (e.g., `type ButtonVariant`)

### TypeScript

- **Always use TypeScript** for new files
- **Define types/interfaces** for all props and return values
- **Avoid `any` type** - use `unknown` if type is truly unknown
- **Export types** from `src/lib/types.ts` for reusability

Example:
```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  // implementation
}

// Bad
export function Button(props: any) {
  // implementation
}
```

### Component Guidelines

#### Client vs Server Components

- **Default to Server Components** for better performance
- **Use Client Components** only when needed:
  - useState, useEffect, or other hooks
  - Event handlers
  - Browser APIs

Mark client components explicitly:
```typescript
"use client";

import { useState } from 'react';
```

#### Component Structure

```typescript
"use client"; // Only if needed

import { useState } from 'react'; // React imports first
import Link from 'next/link'; // Next.js imports
import { Button } from '@/components/common/Button'; // Local imports
import type { ComponentProps } from '@/lib/types'; // Type imports last

interface ComponentNameProps {
  // Props definition
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // implementation
  };
  
  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

### Styling Guidelines

#### Tailwind CSS

- **Use Tailwind classes** exclusively (no custom CSS)
- **Follow responsive design** patterns: `sm:`, `md:`, `lg:`, `xl:`
- **Use design system colors:**
  - Primary: `blue-600` to `indigo-600`
  - Success: `green-600`
  - Danger: `red-600`
  - Warning: `yellow-600`

Example:
```tsx
<button className="
  px-4 py-2 
  bg-linear-to-r from-blue-600 to-indigo-600 
  text-white font-medium rounded-lg
  hover:shadow-lg
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Submit
</button>
```

#### Responsive Design

Always consider mobile-first:
```tsx
<div className="
  flex flex-col sm:flex-row
  gap-4 sm:gap-6
  p-4 sm:p-6 lg:p-8
">
  {/* Content */}
</div>
```

### Accessibility

- Use semantic HTML elements
- Add `aria-label` for icon buttons
- Ensure keyboard navigation works
- Maintain color contrast ratios

Example:
```tsx
<button 
  aria-label="Close menu"
  className="p-2"
>
  <XIcon />
</button>
```

---

## Making Changes

### Branch Naming

Create descriptive branch names:

- **Features:** `feature/add-product-comparison`
- **Fixes:** `fix/cart-quantity-validation`
- **Refactor:** `refactor/simplify-api-layer`
- **Documentation:** `docs/update-readme`

### Coding Process

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Add comments for complex logic
   - Follow existing patterns

3. **Test your changes:**
   - Test in browser (desktop + mobile)
   - Check for console errors
   - Verify responsive design
   - Test edge cases

4. **Lint your code:**
   ```bash
   pnpm lint
   ```

5. **Build to check for errors:**
   ```bash
   pnpm build
   ```

### Adding New Features

When adding a new feature:

1. **Create types first** in `src/lib/types.ts`
2. **Add API functions** if needed in `src/lib/api.ts`
3. **Create hooks** if needed in `src/hooks/`
4. **Build components** in appropriate directory
5. **Update mock data** if using mock system
6. **Update documentation** in README.md

---

## Commit Guidelines

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(cart): Add stock validation when updating quantity"

# Fix
git commit -m "fix(header): Cart count not updating after adding item"

# Documentation
git commit -m "docs: Add API documentation for cart endpoints"

# Refactor
git commit -m "refactor(hooks): Simplify useCart hook logic"
```

### Commit Best Practices

- **Keep commits atomic** - one logical change per commit
- **Write clear messages** - explain what and why, not how
- **Reference issues** - include issue numbers when applicable
- **Avoid large commits** - break big changes into smaller commits

---

## Pull Request Process

### Before Creating PR

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Resolve conflicts** if any

3. **Run final checks:**
   ```bash
   pnpm lint
   pnpm build
   ```

### Creating the PR

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request** on GitHub

3. **Fill out PR template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tested in development
   - [ ] Tested responsive design
   - [ ] No console errors
   - [ ] TypeScript types correct
   
   ## Screenshots
   (if applicable)
   
   ## Related Issues
   Closes #123
   ```

### PR Guidelines

- **Keep PRs focused** - one feature/fix per PR
- **Write descriptive titles** - summarize the change
- **Include screenshots** for UI changes
- **Link related issues** using keywords (Closes #123)
- **Request review** from maintainers

---

## Code Review Process

### For Contributors

When your PR is reviewed:

1. **Respond to feedback** promptly and professionally
2. **Make requested changes** in new commits
3. **Explain your reasoning** if you disagree with feedback
4. **Mark conversations resolved** after addressing them

### For Reviewers

When reviewing PRs:

1. **Be constructive** and respectful
2. **Explain the "why"** behind suggestions
3. **Distinguish between** "must fix" and "nice to have"
4. **Test the changes** locally when possible

### Review Checklist

- [ ] Code follows project standards
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Responsive design works
- [ ] No accessibility issues
- [ ] Code is well-documented
- [ ] No breaking changes (or properly documented)

---

## Testing

### Manual Testing

Before submitting PR, test:

1. **Feature functionality** - does it work as expected?
2. **Edge cases** - what happens with empty data, errors, etc.?
3. **Responsive design** - works on mobile, tablet, desktop?
4. **Browser compatibility** - test in Chrome, Firefox, Safari
5. **Performance** - no noticeable lag or issues

### Test Checklist

- [ ] Feature works in development mode
- [ ] Build succeeds without errors
- [ ] No console errors or warnings
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly

---

## Common Tasks

### Adding a New Component

1. Create component file:
   ```bash
   src/components/common/NewComponent.tsx
   ```

2. Define types:
   ```typescript
   interface NewComponentProps {
     // props
   }
   ```

3. Implement component:
   ```typescript
   export default function NewComponent({ prop }: NewComponentProps) {
     return <div>Component</div>;
   }
   ```

4. Export if needed:
   ```typescript
   // In index.ts
   export { default as NewComponent } from './NewComponent';
   ```

### Adding a New Hook

1. Create hook file:
   ```bash
   src/hooks/useNewFeature.ts
   ```

2. Implement hook:
   ```typescript
   "use client";
   
   import { useState, useEffect } from 'react';
   
   export function useNewFeature() {
     const [state, setState] = useState();
     
     // Hook logic
     
     return { state, /* other values */ };
   }
   ```

### Adding New Types

1. Add to `src/lib/types.ts`:
   ```typescript
   export interface NewType {
     id: number;
     name: string;
     // other fields
   }
   ```

2. Export for use:
   ```typescript
   import type { NewType } from '@/lib/types';
   ```

---

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues/PRs
3. Open a new issue with the question

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Easy Sakan! 🚀
