/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        tsconfigPaths(),
    ],

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
