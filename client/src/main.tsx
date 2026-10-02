import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;

// Every public page is prerendered at build time (scripts/prerender.mjs), so
// React attaches to the HTML that is already on screen instead of replacing
// it: no blank flash, and images start loading before any JavaScript runs.
// A page without prerendered markup (local `vite` dev) renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
