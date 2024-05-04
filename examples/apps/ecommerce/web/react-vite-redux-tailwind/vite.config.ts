import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig(({ _, mode }) => {

  /* Loading environment variables */
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: env.VITE_APP_PORT, /* APP Port */
    },
  };
});
