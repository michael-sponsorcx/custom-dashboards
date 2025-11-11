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
  - `ChartType`, `LayoutType`, `SortOrder` (enums)
  - `Query`, `Mutation` (GraphQL operations)
