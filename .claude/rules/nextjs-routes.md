---
paths:
- src/app/**/*.tsx
- src/app/**/*.ts
---

# Next.js 14 App Router Guidelines

## Route Organization

```
src/app/
├── page.tsx                    # Landing page (/)
├── layout.tsx                  # Root layout
├── progress/
│   └── page.tsx                # /progress
├── admin/
│   ├── page.tsx                # /admin
│   └── layout.tsx              # Admin layout (auth wrapper)
├── math/
│   ├── page.tsx                # /math (module selection)
│   ├── addition/
│   │   └── page.tsx            # /math/addition
│   └── subtraction/
│       └── page.tsx            # /math/subtraction
└── spelling/
    └── page.tsx                # /spelling
```

## Page Components

Pages are React Server Components by default. Mark as client component when needed:

```typescript
'use client'; // Only when using hooks, browser APIs, or interactivity

export default function GamePage() {
  // Implementation
}
```

**When to use 'use client':**
- Game pages (need useState, useEffect, etc.)
- Interactive forms
- Components using browser APIs (audio, localStorage)

**When to keep server component:**
- Static pages (landing, selection pages)
- Pages that just fetch and display data

## Navigation

Use Next.js Link component:

```typescript
import Link from 'next/link';

<Link href="/math/addition" className="...">
  Addition
</Link>
```

**For programmatic navigation:**
```typescript
'use client';
import { useRouter } from 'next/navigation';

export function Component() {
  const router = useRouter();
  
  const handleComplete = () => {
    router.push('/progress');
  };
}
```

## Layouts

Use layouts for shared UI (headers, footers, authentication):

```typescript
// src/app/admin/layout.tsx
import { AdminAuthCheck } from '@/components/admin/AdminAuthCheck';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthCheck>
      {children}
    </AdminAuthCheck>
  );
}
```

## Loading and Error States

Use Next.js conventions:

```typescript
// loading.tsx - Shows while page loads
export default function Loading() {
  return <LoadingSpinner />;
}

// error.tsx - Shows on errors
'use client';
export default function Error({ error }: { error: Error }) {
  return <ErrorDisplay message={error.message} />;
}
```

## Metadata

Export metadata from pages:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Addition Game - Smarty Pants',
  description: '2nd grade addition practice'
};
```

## API Routes (If Needed)

Smarty Pants uses Supabase directly (no API routes). If you need server-side logic:

```typescript
// src/app/api/[endpoint]/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // Server-side logic
  return Response.json({ success: true });
}
```

**For this project:** Database queries go through Supabase client, not API routes.
