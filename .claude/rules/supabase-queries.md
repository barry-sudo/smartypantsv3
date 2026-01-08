---
paths:
- src/lib/supabase/**/*.ts
- src/hooks/**/*.ts
---

# Supabase Query Guidelines

## Client Usage

Always use the centralized client from `src/lib/supabase/client.ts`:

```typescript
import { supabase } from '@/lib/supabase/client';

// Never create new clients - use this one
```

## Query Organization

All database queries live in `src/lib/supabase/queries/`:

```
src/lib/supabase/queries/
├── sessions.ts      # Session CRUD operations
├── attempts.ts      # Problem attempt logging
├── stats.ts         # Analytics queries
└── goals.ts         # Goal management
```

## Query Pattern

```typescript
// src/lib/supabase/queries/sessions.ts
import { supabase } from '../client';
import type { Session } from '@/types';

export async function createSession(
  userId: string,
  module: 'addition' | 'subtraction' | 'spelling'
): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, module, started_at: new Date().toISOString() })
    .select()
    .single();
  
  if (error) {
    console.error('Failed to create session:', error);
    return null;
  }
  
  return data;
}
```

## Error Handling

**Always handle errors explicitly:**

```typescript
const { data, error } = await supabase
  .from('sessions')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('Query failed:', error);
  return null; // or throw, depending on context
}

return data;
```

**Never:** Silent failures or unchecked errors

## Type Safety

Use TypeScript types from `src/types/`:

```typescript
import type { Session, GameModule, ProblemAttempt } from '@/types';

export async function getSessions(
  userId: string,
  module?: GameModule
): Promise<Session[]> {
  // Typed return value
}
```

## Real-time Subscriptions (If Needed)

For real-time features (not in MVP):

```typescript
const subscription = supabase
  .channel('sessions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'sessions'
  }, (payload) => {
    console.log('New session:', payload.new);
  })
  .subscribe();

// Clean up
subscription.unsubscribe();
```

## Row Level Security (RLS)

All tables have RLS policies enforcing user_id isolation:

```sql
-- Users can only see their own data
CREATE POLICY "users_own_data" ON sessions
  FOR SELECT USING (auth.uid() = user_id);
```

**In code:** Just query normally - RLS enforces access automatically.

## Authentication

Get current user:

```typescript
const { data: { user }, error } = await supabase.auth.getUser();

if (!user) {
  // Handle not authenticated
}
```

## Storage (Assets)

Access public storage buckets:

```typescript
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('image1.jpg');

// data.publicUrl contains the CDN URL
```

**For this project:** Asset URLs are pre-generated in `src/lib/assets.ts`

## Testing Database Queries

Use test database, not production:

```typescript
// In tests, connect to test Supabase project
import { createClient } from '@supabase/supabase-js';

const testSupabase = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_ANON_KEY!
);
```

See `.claude/rules/testing.md` for full testing patterns.

## Common Patterns

**Insert and return:**
```typescript
const { data } = await supabase
  .from('table')
  .insert({ ...fields })
  .select()
  .single();
```

**Update with conditions:**
```typescript
const { data } = await supabase
  .from('sessions')
  .update({ completed: true })
  .eq('id', sessionId)
  .select()
  .single();
```

**Query with joins:**
```typescript
const { data } = await supabase
  .from('sessions')
  .select(`
    *,
    problem_attempts(*)
  `)
  .eq('user_id', userId);
```

**Aggregate queries:**
```typescript
const { data, count } = await supabase
  .from('sessions')
  .select('*', { count: 'exact' })
  .eq('module', 'addition')
  .eq('completed', true);
```
