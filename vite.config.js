import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/mouse-trail/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        canvas: resolve(__dirname, "canvas.html"),
        chain: resolve(__dirname, "chain.html"),
      },
    },
  },
});
