import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const basePath = process.env.BASE_PATH || "/";
const base = basePath === "/" ? "/" : basePath.endsWith("/") ? basePath : `${basePath}/`;

export default defineConfig({
  base,
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
