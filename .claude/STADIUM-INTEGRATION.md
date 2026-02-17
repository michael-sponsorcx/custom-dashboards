# Stadium Design System Integration Guide

This document explains why the mini frontend has certain "messy" configurations — stubs, plugins, exclusions, and workarounds — all of which exist to integrate Stadium DS into a smaller codebase that doesn't have the full parent app.

---

## The Core Problem

Stadium DS (`src/stadiumDS/`) is a complete design system extracted from a much larger SponsorCX application. It references modules, stores, contexts, and utilities from that parent app. This mini codebase doesn't have those modules, so we need stubs and build plugins to prevent crashes while still consuming Stadium's theme, components, and patterns.

**The rule:** Stadium is read-only. Never modify files inside `src/stadiumDS/`.

---

## Build & Config Workarounds

### 1. Vite Stub Plugin — `vite.config.ts`

**Problem:** Stadium components import things like `@/components/DataTable/SavedViews/SavedViewsManager` or other app modules that don't exist here. Vite crashes on unresolvable imports.

**Solution:** The `stadiumStubPlugin` (lines 16–51) intercepts imports originating from `stadiumDS/` files. If the import can't be resolved to a real file, it returns an empty virtual module (`export default {}; export {};`) instead of crashing.

```
stadiumDS/PageHeader/index.tsx
  → imports @/components/DataTable/SavedViews/SavedViewsManager
  → file doesn't exist
  → stadiumStubPlugin returns empty module
  → PageHeader loads without crashing
```

The plugin only stubs imports **from** Stadium files — your app code still gets normal resolution errors if something is missing.

### 2. TypeScript Exclusion — `tsconfig.json`

**Problem:** Stadium files reference types and modules that don't exist in this codebase, causing hundreds of TypeScript errors.

**Solution:** `"exclude": ["src/stadiumDS/**/*"]` tells TypeScript to skip type-checking Stadium files entirely.

**Caveat:** TypeScript `exclude` only prevents files from being root compilation targets. If your app code imports a Stadium file, TypeScript still follows that import and may type-check it transitively. This means your IDE might still show some red squiggles from Stadium — that's expected and harmless.

### 3. Path Resolution — `vite.config.ts`

The `@/` path alias is configured in two places for redundancy:

- **`tsconfig.json` paths:** `"@/*": ["src/*"]` — for TypeScript/IDE resolution
- **`vite.config.ts` resolve.alias:** `'@': path.resolve(__dirname, './src')` — fallback for `vite-tsconfig-paths` edge cases (files in excluded zones)

Both are needed because `vite-tsconfig-paths` doesn't always resolve `@/` for files that tsconfig excludes.

---

## Stub Files

### 4. `src/state.ts` — Zustand Store Stub

**Problem:** Stadium's PageHeader imports `useStore` from `@/state` to read `organization.id` and `sidebarCollapsed`.

**Solution:** Minimal stub that returns default values:

```typescript
const state = {
  organization: { id: '', name: '' },
  sidebarCollapsed: false,
  setSidebarCollapsed: (_collapsed: boolean) => {},
  setOrganization: (_org: { id: string; name: string }) => {},
};

const useStore = <T>(selector: (s: typeof state) => T): T => selector(state);
export default useStore;
```

PageHeader calls `useStore(s => s.organization)` — the stub returns an empty org object, which is fine for the mini app.

### 5. `src/context/index.ts` — UserContext Stub

**Problem:** Stadium's PageHeader imports `UserContext` from `@/context` to read the logged-in user (for SavedViewsManager).

**Solution:** React Context with a default `{ user: null }` value. PageHeader reads it without crashing; SavedViewsManager just won't show user-specific saved views.

---

## Dashboard Filter Architecture

The dashboard filter system has three layers that work together:

### URL Query Params (Source of Truth)

Filter selections are stored in the URL as query parameters with an `f_` prefix:

```
/?f_region=North&f_region=South&f_category=Sponsorship&search=nike
```

This makes filters shareable, bookmarkable, and persistent across page refreshes.

**Key files:**

- **`src/hooks/useFilterHelpers.ts`** — Reusable hook that bridges Stadium's PageHeader filter UI with URL query params. Mirrors the pattern from Stadium's `useUploadsFilters`. Handles all filter types (multiselect, dateRange, range, boolean, select).

- **`src/components/dashboard/hooks/useDashboardFilterQueryParams.ts`** — Dashboard-specific hook that dynamically builds `useQueryParams` config from available dimension fields. Each dimension field becomes an `ArrayParam` keyed as `f_{fieldName}`.

- **`src/components/dashboard/hooks/usePageHeaderFilters.ts`** — The main orchestration hook. Composes the two hooks above, fetches dimension options for filter dropdowns, and syncs URL state down to Zustand.

### Zustand Store (Sync Mirror)

`src/store/dashboardFilterStore.ts` holds the same filter state for downstream consumers (GraphCard, DownloadPDF, Present) that read from the store rather than the URL.

The `_syncDimensionFiltersFromUrl()` method is a one-way sync: URL → Zustand. It intentionally does NOT call `saveFilters()` to avoid excessive API calls on every URL change.

```
User changes filter in PageHeader
  → URL updates immediately (via useFilterHelpers → setQueryParams)
  → useDashboardFilterQueryParams parses URL → DimensionFilterRule[]
  → usePageHeaderFilters calls _syncDimensionFiltersFromUrl()
  → Zustand store updated → GraphCard/DownloadPDF/Present re-render
```

### Filter Configuration (SlideOut)

`DashboardFilterSlideOut.tsx` manages which data sources and fields are available for filtering — it writes to `selectedViews` and `availableFields` in the store. It does NOT manage active filter values (those live in the URL).

`DashboardFilterModal.tsx` is the deprecated predecessor. Marked `@deprecated` — use the SlideOut instead.

---

## CSS Overrides

### `src/components/dashboard/dashboard-overrides.css`

Loaded in `main.tsx` after all Mantine stylesheets. Contains fixes for:

- **React Grid Layout** placeholder color → Stadium `Brand[500]`
- **Menu.Sub dropdowns** → open left instead of right to prevent viewport overflow
- Uses `!important` sparingly where Mantine inline styles can't be overridden otherwise

These are exceptions to the "everything through Stadium" rule, justified by specific layout bugs.

---

## Quick Reference

| File | What | Why |
|---|---|---|
| `vite.config.ts` stadiumStubPlugin | Stubs unresolvable Stadium imports | Stadium references modules from parent app |
| `tsconfig.json` exclude | Skips Stadium type-checking | Prevents hundreds of TS errors |
| `vite.config.ts` resolve.alias | Fallback `@/` resolution | `vite-tsconfig-paths` misses excluded files |
| `src/state.ts` | Zustand store stub | PageHeader imports `useStore` |
| `src/context/index.ts` | UserContext stub | PageHeader imports `UserContext` |
| `src/hooks/useFilterHelpers.ts` | Filter ↔ URL bridge | Mirrors Stadium's useUploadsFilters pattern |
| `src/components/dashboard/hooks/useDashboardFilterQueryParams.ts` | Dynamic URL param config | Builds f_ params from available fields |
| `src/components/dashboard/hooks/usePageHeaderFilters.ts` | Orchestration hook | Ties PageHeader, URL, and Zustand together |
| `src/store/dashboardFilterStore.ts` _syncDimensionFiltersFromUrl | One-way URL→Store sync | Keeps Zustand in sync without saving to backend |
| `dashboard-overrides.css` | Grid + Menu CSS fixes | Layout bugs Stadium doesn't handle |
| `src/main.tsx` | MantineProvider + Stadium theme | Applies Stadium as the app's theme |

---

## Adding New Stadium Components

If you pull in a new Stadium component and Vite crashes:

1. The `stadiumStubPlugin` should handle it automatically — check the console for `stadium-stub:` prefixed modules
2. If the component needs a real import (not just a stub), create a minimal stub file at the expected path
3. Follow the pattern of `src/state.ts` and `src/context/index.ts` — provide the minimum interface the Stadium component expects
4. Never modify Stadium source files

---

## Parent App Style Tokens

Style values extracted from the parent application for consistency when Stadium DS does not define them.

### Card Styles

Applies to: Graph cards, and any future card-like containers that must match the parent app.

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| border-radius   | `4px` (Mantine `radius="sm"`)          |
| box-shadow      | `rgba(0, 0, 0, 0.07) 0px 0px 5px 1px` |
| border          | `1px solid rgb(230, 230, 230)`         |

```tsx
<Paper
  radius="sm"
  style={{
    border: '1px solid rgb(230, 230, 230)',
    boxShadow: 'rgba(0, 0, 0, 0.07) 0px 0px 5px 1px',
  }}
>
```

Note: Stadium's shadow tokens are all directional/downward. The parent app uses a uniform ambient glow, so the `boxShadow` must be set inline.

### Buttons

> **TODO:** Enforce parent-app button styles using these same border-radius / shadow tokens once button audit is complete.
