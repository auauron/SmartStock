/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { VitePWA } from 'vite-plugin-pwa';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-16.png', 'favicon-32.png', 'favicon-256.png', 'smartstock.png'],
      manifest: {
        name: 'Smart Stock',
        short_name: 'SmartStock',
        description: 'Inventory management for small businesses',
        theme_color: '#059669',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon-16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/favicon-32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/favicon-256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/smartstock.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: '/smartstock.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Smart Stock Dashboard',
          },
        ],
      },
      workbox: {
        // Cache app shell and critical routes
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache Supabase API responses (stale-while-revalidate)
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
        ],
      },
      devOptions: {
        // Enable PWA in dev mode to test install prompt
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/__tests__/**/*.test.ts'],
          exclude: ['src/__tests__/**/*.integration.test.ts'],
          setupFiles: ['./src/__tests__/setup.ts'],
        }
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['src/__tests__/**/*.integration.test.ts'],
          // No setupFiles — intentionally no MSW so real Supabase HTTP calls go through
        }
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
});