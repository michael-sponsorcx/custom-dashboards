# Project Rules and Guidelines

## Stadium Design System — The Law

**ABSOLUTE RULE:** The Stadium design system (`src/stadiumDS/`) is the single source of truth for all visual and styling decisions. Every component, every color, every pixel must conform to Stadium. No exceptions. No excuses. No shortcuts.

**NEVER MODIFY STADIUM FILES.** The `src/stadiumDS/` directory is sacred and read-only. Do not add, edit, or delete any file within it. Stadium is consumed, not changed. If you need app-level theme overrides, add them in `src/main.tsx` via `mergeThemeOverrides` — never in `stadiumDS/foundations/mantineTheme.ts` or any other Stadium file.

### Colors

**NEVER hardcode hex values. NEVER use Mantine CSS variables for colors (e.g., `var(--mantine-color-blue-6)`). ALWAYS use Stadium color tokens.**

```typescript
// CORRECT
import colors from '@/stadiumDS/foundations/colors';
colors.Brand[500]  // '#2E90FA'
colors.Gray[200]   // '#E9EAEB'

// ALSO CORRECT (when you only need primary)
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
primaryColors.Gray[900]

// WRONG — immediate penance required
'var(--mantine-color-blue-6)'
'#2E90FA'  // hardcoded hex
'dimmed'   // Mantine shorthand — use colors.Gray[500] or colors.Gray[600]
```

**Primary Colors:**
- `Base.White` / `Base.Black`
- `Gray[25-950]` — UI chrome, text, borders
- `Brand[25-950]` — Primary blue
- `Error[25-950]` — Destructive/error states
- `Warning[25-950]` — Caution states
- `Success[25-950]` — Positive states

**Secondary Colors:** Moss, GreenLight, Green, Teal, Cyan, LightBlue, Blue, BlueDark, Fuchsia, Pink, Purple, Rose, OrangeDark, Orange, Yellow, Indigo, Violet

**All shades:** 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

**Common mappings:**
- Primary text: `Gray[900]`
- Secondary text: `Gray[600]`
- Placeholder/muted text: `Gray[500]`
- Borders: `Gray[200]`
- Light backgrounds: `Gray[50]`
- Active/interactive: `Brand[500]` or `Brand[600]`
- Required indicator: `Brand[400]`
- Dividers: `Gray[200]` (set in Mantine Divider theme default)

### Typography

- **Font family:** `Inter, sans-serif` — always
- **Text sizes:** Use Mantine `size` prop with theme-defined values (xs=12, sm=14, md=16, lg=18, xl=20)
- **Display sizes:** 2xl=24, 3xl=30, 4xl=36, 5xl=48, 6xl=60, 7xl=72
- **Font weights:** Regular=400, Medium=500, Semibold=600, Bold=700
- **Heading hierarchy:** h1=36/700, h2=30/600, h3=24/600, h4=20/600, h5=18/500, h6=16/500

### Spacing

Use multiples of 4px. Common values: 4, 8, 12, 16, 20, 24, 32.

### Border Radius

- Standard components (inputs, buttons, dropdowns): `8px`
- Larger containers (modals, cards, dropzone): `12px`
- Content cards (Paper): `16px` (set in theme)
- Circular elements: `50%`

### Borders

- Standard: `1px solid Gray[200]` or `Gray[300]`
- Active/focused: `2px solid Brand[500]`
- Input fields: `1px solid` with Gray[4] in Mantine index
- Never use `withBorder` on content cards — use dividers between sections instead

### Shadows

Use Mantine shadow tokens defined in the theme (xs, sm, md, lg, xl, 2xl, 3xl). Shadow base: `rgba(10, 13, 18, opacity)`.

- Content cards: **no shadow** (theme default)
- Floating elements (toasts, dropdowns): shadow `md` or `lg`
- Interactive tiles with hover: shadow `sm`, promote to `md` on hover

### Cards / Paper

The Mantine `Paper` component is globally themed to Stadium defaults:
- `radius: 16`, `padding: 32`, `shadow: none`, `background: Gray[50]`
- Do NOT add `withBorder`, `shadow`, `radius`, or `p` to Paper unless overriding for a floating/utility element
- Floating elements (toasts, dropdowns) must explicitly set `shadow`, `backgroundColor: 'white'`, and smaller `radius`/`padding`

### Component Styling

- **Mantine components:** Override via `classNames` with CSS modules in `stadiumDS/foundations/mantineComponentStyles/`
- **Complex dynamic styles:** Use styled-components with `styled.` exports or `css` template literals via `styled-components/macro`
- **Transient props:** Use `$` prefix for styled-component props that shouldn't reach the DOM (e.g., `$isOpen`, `$scale`)
- **Portal config:** Most overlays use `withinPortal: false`

### What NOT to Do

- Never use `c="dimmed"` — use explicit Stadium Gray values
- Never use Mantine CSS variables for colors — use Stadium color imports
- Never hardcode hex colors — always reference the color token
- Never add `withBorder` to content cards
- Never define shadows inline — use theme shadow tokens
- Never use `function` keyword — use arrow functions (see TypeScript section)

---

## Package Management

**IMPORTANT:** This project uses **Yarn** as its package manager, NOT npm.

- Use `yarn` commands for all package management operations
- Use `yarn add <package>` to install dependencies (not `npm install`)
- Use `yarn remove <package>` to remove dependencies (not `npm uninstall`)
- Use `yarn build`, `yarn test`, etc. for running scripts
- Never use `npm` commands in this project

## TypeScript Guidelines

**IMPORTANT:** Never use the `any` type in TypeScript code.

- Always use proper TypeScript types
- Use `unknown` instead of `any` when the type is truly unknown
- Define explicit interfaces and types for all data structures
- If you must work with dynamic data, use type guards or assertions

**IMPORTANT:** Always use arrow functions for all function declarations.

- Use arrow functions for component definitions: `export const MyComponent = () => { ... }`
- Use arrow functions for helper functions and utilities
- Use arrow functions for event handlers and callbacks
- Example:
  ```typescript
  // Good
  export const MyComponent = () => {
    const handleClick = () => {
      console.log('clicked');
    };
    return <button onClick={handleClick}>Click me</button>;
  };

  // Avoid
  export function MyComponent() {
    function handleClick() {
      console.log('clicked');
    }
    return <button onClick={handleClick}>Click me</button>;
  }
  ```

## Backend Types

**IMPORTANT:** Use the auto-generated GraphQL types from the backend for all API-related type definitions.

- Import types from `../sponsorcx-frontend-mini/src/types/backend-graphql.ts`
- This file contains all GraphQL schema types, queries, mutations, and input types
- DO NOT manually define types that already exist in this file
- The backend types are the single source of truth for API contracts
- Examples of available types:
  - `Dashboard`, `DashboardInput`
  - `Graph`, `GraphInput`
  - `DashboardGridItem`, `DashboardGridItemInput`
  - `ChartType`, `LayoutType`, `SortOrder`, `NumberFormat`, `LegendPosition` (enums)
  - `Query`, `Mutation` (GraphQL operations)

### Enum Mapping

The backend uses uppercase GraphQL enum values (e.g., `ChartType.Bar`, `SortOrder.Asc`) while the frontend may use lowercase values for better developer experience. When sending data to the backend:

- **Use the mapper**: Import `toGraphInput` from `sponsorcx-frontend-mini/src/services/backendCube/utils/graphInputMapper.ts`
- The mapper automatically converts frontend enum values to backend enum values
- Example: `'asc'` → `SortOrder.Asc`, `'bar'` → `ChartType.Bar`, `'horizontalStackedBar'` → `ChartType.Bar`
- The graph API services already use this mapper, so you don't need to worry about enum conversion when using those services

## Architecture Rules

**IMPORTANT:** Enums must be shared across the entire frontend and backend. Never define enums independently on either side.

- All enums are defined once in the backend GraphQL schema (`sponsorcx-backend-mini/src/graphql/types.ts`)
- TypeScript enums are auto-generated via `yarn codegen` and synced to the frontend via `yarn codegen:sync`
- The frontend must import enums from `sponsorcx-frontend-mini/src/types/backend-graphql.ts` — never define duplicate or parallel enum types
- When a new enum is needed, add it to the backend schema first, then run `yarn codegen:sync`

**IMPORTANT:** All frontend API calls must conform to the GraphQL backend schema.

- The generated types in `backend-graphql.ts` are the single source of truth for request/response shapes
- Frontend service functions must use the generated input types (e.g., `GraphInput`, `DashboardInput`) for mutations
- Frontend must use the generated output types (e.g., `Graph`, `Dashboard`) for query responses
- Do not create ad-hoc request/response types that diverge from the schema
- Frontend API service files (`src/api/`) must never define local interfaces that duplicate generated types — import them from `backend-graphql.ts`
- Frontend-only UI types (form data, table rows) with no backend equivalent may be defined locally

## SQL Schema Guidelines

**IMPORTANT:** Follow these conventions when creating or editing database schema files.

- Use `bigserial` for primary keys (not `serial`) for larger ID range in production
- Define primary keys inline: `id bigserial PRIMARY KEY`
- Use `references` for foreign keys: `user_id bigint NOT NULL REFERENCES users(id)`
- Always specify `ON DELETE` behavior (`CASCADE`, `SET NULL`, or `RESTRICT`)
- Place indexes immediately after their table definition
- Example:
  ```sql
  CREATE TABLE example_table (
      id bigserial PRIMARY KEY,
      user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX idx_example_table_user_id ON example_table(user_id);
  CREATE INDEX idx_example_table_created_at ON example_table(created_at);
  ```
