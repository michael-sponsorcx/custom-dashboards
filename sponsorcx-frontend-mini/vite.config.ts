/**
 * DEPRECATION NOTICE:
 * The custom plugins below (stadiumOverridePlugin, stadiumStubPlugin) and related
 * workarounds will be deprecated once we move to the new system. They exist solely
 * to integrate the read-only stadiumDS package into this mini codebase.
 */

/// <reference types="vitest" />
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import babelMacros from 'vite-plugin-babel-macros';
import { configDefaults } from 'vitest/config';
import fs from 'fs';

/**
 * Vite plugin that redirects specific stadiumDS modules to app-level overrides.
 * Allows extending Stadium components (e.g. adding tabs to a slideout)
 * without modifying the read-only stadiumDS directory.
 */
const stadiumOverridePlugin = (): Plugin => {
    const overrides: Record<string, string> = {
        // Redirect PageHeaderFilterSlideOut to our version that adds a "Configure" tab
        [path.resolve(__dirname, './src/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilterSlideOut')]:
            path.resolve(__dirname, './src/overrides/PageHeaderFilterSlideOut.tsx'),
    };

    return {
        name: 'stadium-override',
        enforce: 'pre',
        resolveId(source, importer) {
            if (!importer) return null;

            // Resolve relative imports to absolute paths
            let resolved = source;
            if (source.startsWith('.')) {
                resolved = path.resolve(path.dirname(importer), source);
            }

            // Strip extensions for matching
            const withoutExt = resolved.replace(/\.(ts|tsx|js|jsx)$/, '');

            if (overrides[withoutExt]) {
                return overrides[withoutExt];
            }

            return null;
        },
    };
};

/**
 * Vite plugin that stubs unresolvable imports originating from stadiumDS.
 * Stadium DS files reference modules from the larger app that don't exist
 * in this mini codebase. Instead of crashing, return an empty module.
 */
const stadiumStubPlugin = (): Plugin => {
    const srcDir = path.resolve(__dirname, './src');

    return {
        name: 'stadium-stub',
        enforce: 'pre',
        resolveId(source, importer) {
            // Only handle imports FROM stadiumDS files
            if (!importer?.includes('stadiumDS')) return null;

            // Let normal resolution handle it first — only stub if it fails
            const resolved = source.startsWith('@/')
                ? path.resolve(srcDir, source.slice(2))
                : null;

            if (!resolved) return null;

            // Check common extensions
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
            for (const ext of extensions) {
                if (fs.existsSync(resolved + ext)) return null;
                // Check for index file in directory
                if (fs.existsSync(path.join(resolved, `index${ext}`))) return null;
            }

            // Can't find it — return virtual stub module
            return `\0stadium-stub:${source}`;
        },
        load(id) {
            if (id.startsWith('\0stadium-stub:')) {
                // Return an empty module with a default export
                return 'export default {}; export {};';
            }
        },
    };
};

export default defineConfig(({ mode }) => ({
    plugins: [
        stadiumOverridePlugin(),
        stadiumStubPlugin(),
        react(),
        tsconfigPaths(),
        babelMacros(),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    server: {
        port: 3000,
    },

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
        exclude: [
            ...configDefaults.exclude,
            '**/*.stories.{ts,tsx}',
        ],
    },

    build: {
        sourcemap: mode === 'development',
        chunkSizeWarningLimit: 1000,
    },
}));
