import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // Listen on all interfaces so other LAN devices can open the app.
        // Localhost on this machine still works.
        host: '0.0.0.0',
        port: 5173,
    },
});
