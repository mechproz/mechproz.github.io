import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// relative base, so the same build works at mechproz.github.io or at
// mechproz.github.io/<repo>/. one less thing to remember if i rename the repo.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
