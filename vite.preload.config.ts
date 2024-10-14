import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_NAME__: JSON.stringify(process.env.npm_package_name),
    },
});
