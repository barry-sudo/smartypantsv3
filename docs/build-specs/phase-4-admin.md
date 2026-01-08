# Build Spec: Phase 4 - Admin Panel & Goals

**Phase:** 4  
**Feature:** Parent admin panel with goal management  
**Complexity:** Medium  
**Estimated Time:** ~3 hours  
**Status:** ⏳ Not Started

---

## Objective

Build hidden admin panel for parents to create and manage reward goals. Access via 3-second press on logo + PIN 2018.

---

## Prerequisites

- [x] Phase 3 complete (dashboard displays goals)
- [x] Goals table and goal_progress view exist
- [x] Database queries can create/update goals

---

## What to Build

### Files to Create

1. `src/app/admin/page.tsx` - Admin panel page
2. `src/app/admin/layout.tsx` - Auth wrapper (PIN check)
3. `src/components/admin/AdminAuth.tsx` - PIN entry component
4. `src/components/admin/GoalForm.tsx` - Create/edit goal form
5. `src/components/admin/GoalList.tsx` - Active goals list
6. `src/lib/supabase/queries/goals.ts` - Goal CRUD operations
7. `src/hooks/useAdminAuth.ts` - Admin session management

---

## Hidden Access Pattern

**Trigger:** 3-second press-and-hold on "Smarty Pants" logo on landing page

**Location:** `src/app/page.tsx` (modify existing landing page)

```typescript
export default function LandingPage() {
  const router = useRouter();
  const [pressStart, setPressStart] = useState<number | null>(null);
  
  const handleLogoPress = () => {
    setPressStart(Date.now());
  };
  
  const handleLogoRelease = () => {
    if (pressStart && Date.now() - pressStart >= 3000) {
      router.push('/admin');
    }
    setPressStart(null);
  };
  
  return (
    // ...
    <h1 
      onMouseDown={handleLogoPress}
      onMouseUp={handleLogoRelease}
      onTouchStart={handleLogoPress}
      onTouchEnd={handleLogoRelease}
      className="text-6xl font-bold text-orange cursor-pointer"
    >
      Smarty Pants
    </h1>
    // ...
  );
}
```

---

## PIN Authentication

**Location:** `src/app/admin/layout.tsx`

```typescript
'use client';

import { useState } from 'react';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <AdminAuth onLogin={login} />;
  }
  
  return <>{children}</>;
}
```

**Location:** `src/components/admin/AdminAuth.tsx`

```typescript
interface AdminAuthProps {
  onLogin: (pin: string) => boolean;
}

export function AdminAuth({ onLogin }: AdminAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    const success = onLogin(pin);
    if (!success) {
      setError('Incorrect PIN');
      setPin('');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange">
        <h2 className="text-3xl font-bold text-jungle mb-8">Parent Access</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter PIN"
          className="text-2xl px-6 py-3 border-4 border-jungle rounded-xl w-full mb-4"
          autoFocus
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full text-2xl py-3 bg-orange text-white rounded-xl font-bold"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
```

**Location:** `src/hooks/useAdminAuth.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

const ADMIN_PIN = '2018';
const SESSION_KEY = 'admin_authenticated';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for existing session
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const { timestamp } = JSON.parse(sessionData);
      if (Date.now() - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);
  
  const login = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };
  
  return { isAuthenticated, login, logout };
}
```

---

## Goal Management

**Location:** `src/app/admin/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GoalForm } from '@/components/admin/GoalForm';
import { GoalList } from '@/components/admin/GoalList';
import { getActiveGoal, getAllGoals } from '@/lib/supabase/queries/goals';

export default function AdminPanel() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    if (user) {
      getAllGoals(user.id).then(setGoals);
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border-4 border-orange">
          <h1 className="text-4xl font-bold text-jungle mb-8">
            Goal Management
          </h1>
          
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 bg-orange text-white rounded-xl font-bold text-xl"
          >
            + Create New Goal
          </button>
          
          {showForm && (
            <GoalForm 
              userId={user?.id || ''}
              onComplete={() => {
                setShowForm(false);
                // Refresh goals
              }}
            />
          )}
          
          <GoalList goals={goals} onUpdate={() => {/* refresh */}} />
        </div>
      </div>
    </div>
  );
}
```

**Location:** `src/components/admin/GoalForm.tsx`

```typescript
interface GoalFormProps {
  userId: string;
  onComplete: () => void;
}

export function GoalForm({ userId, onComplete }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionsRequired, setSessionsRequired] = useState(10);
  const [minAccuracy, setMinAccuracy] = useState<number | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    await createGoal(userId, {
      title,
      description,
      sessions_required: sessionsRequired,
      min_accuracy: minAccuracy,
      module_filter: moduleFilter as any
    });
    onComplete();
  };
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-2xl font-bold mb-4">Create New Goal</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block font-bold mb-2">Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Lego Set"
            className="w-full px-4 py-2 border-2 border-jungle rounded-lg"
          />
        </div>
        
        <div>
          <label className="block font-bold mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Complete 10 sessions to earn..."
            className="w-full px-4 py-2 border-2 border-jungle rounded-lg"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block font-bold mb-2">Sessions Required</label>
          <input
            type="number"
            value={sessionsRequired}
            onChange={(e) => setSessionsRequired(parseInt(e.target.value))}
            min={1}
            max={100}
            className="w-full px-4 py-2 border-2 border-jungle rounded-lg"
          />
        </div>
        
        <div>
          <label className="block font-bold mb-2">Minimum Accuracy (optional %)</label>
          <input
            type="number"
            value={minAccuracy || ''}
            onChange={(e) => setMinAccuracy(e.target.value ? parseInt(e.target.value) : null)}
            min={0}
            max={100}
            placeholder="Leave blank for no requirement"
            className="w-full px-4 py-2 border-2 border-jungle rounded-lg"
          />
        </div>
        
        <div>
          <label className="block font-bold mb-2">Module Filter (optional)</label>
          <select
            value={moduleFilter || ''}
            onChange={(e) => setModuleFilter(e.target.value || null)}
            className="w-full px-4 py-2 border-2 border-jungle rounded-lg"
          >
            <option value="">All modules</option>
            <option value="addition">Addition only</option>
            <option value="subtraction">Subtraction only</option>
            <option value="spelling">Spelling only</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-orange text-white rounded-xl font-bold"
          >
            Create Goal
          </button>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gray-300 rounded-xl font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Database Operations

**Location:** `src/lib/supabase/queries/goals.ts`

```typescript
import { supabase } from '../client';
import type { Goal } from '@/types';

export async function createGoal(
  userId: string,
  goalData: Partial<Goal>
): Promise<Goal | null> {
  // First, deactivate any existing active goals
  await supabase
    .from('goals')
    .update({ active: false })
    .eq('user_id', userId)
    .eq('active', true);
  
  // Create new goal
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      ...goalData,
      active: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('Failed to create goal:', error);
    return null;
  }
  
  return data;
}

export async function getActiveGoal(userId: string): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .single();
    
  if (error) return null;
  return data;
}

export async function endGoal(goalId: string): Promise<void> {
  await supabase
    .from('goals')
    .update({ active: false })
    .eq('id', goalId);
}
```

---

## Success Criteria

### Functional
- [ ] Can access admin via 3-second logo press
- [ ] PIN authentication works (2018)
- [ ] Session persists 24 hours
- [ ] Can create new goal with all fields
- [ ] Only one active goal at a time
- [ ] Active goal displays on dashboard
- [ ] Can end current goal

### Technical
- [ ] PIN stored securely (not in client code)
- [ ] Admin session uses localStorage
- [ ] Database enforces one active goal constraint
- [ ] Form validation works

---

## Estimated Complexity

**Medium** - ~3 hours

---

## Notes

**Prize photo:** Parent manually replaces `/prizes/current-goal.jpg` in Supabase Storage when setting new goal. No upload UI needed in MVP.

**Security:** PIN is client-side only (acceptable for family app). For multi-user, implement proper Supabase auth roles.
