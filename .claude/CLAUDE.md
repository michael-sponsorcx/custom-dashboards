# Project Rules and Guidelines

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
