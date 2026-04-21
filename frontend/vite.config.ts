import { defineConfig } from 'vite'             
import react from '@vitejs/plugin-react'        
import path from "path"                          // new
import tailwindcss from "@tailwindcss/vite"      // new 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],             // tailwindcss() new
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@convex-api": path.resolve(__dirname, "./src/lib/convex-api.ts"),
      "@convex-data": path.resolve(__dirname, "./src/lib/convex-data.ts"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
  // everything above this line until plugins is new
})
