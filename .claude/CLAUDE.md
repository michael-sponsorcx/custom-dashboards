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
