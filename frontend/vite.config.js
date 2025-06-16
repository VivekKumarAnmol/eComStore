import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allows Vite to expose the service
    port: 3000,  // Use a common port for deployment
    proxy: {
      "/api/": "https://ecomstore-backend-bdh0.onrender.com",
      "/uploads/": "https://ecomstore-backend-bdh0.onrender.com",
    },
  },
});
