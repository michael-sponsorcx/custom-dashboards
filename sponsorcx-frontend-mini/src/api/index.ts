/**
 * API Layer
 *
 * Central export for all API functions.
 *
 * Structure:
 * - core/  : GraphQL client, caching, error handling
 * - cube/  : Cube analytics queries (proxied through backend)
 * - app/   : Application data (dashboards, graphs, KPI alerts)
 */

// Core utilities
export * from './core';

// Cube API (analytics)
export * from './cube';

// Application API (dashboards, graphs, KPI)
export * from './app';
