import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;

// The worker ships real HTML inside #root so crawlers that do not execute
// JavaScript still get headings, copy and internal links (see worker/index.ts).
// That markup is not a React render, so it cannot be hydrated — clear it
// explicitly instead of letting createRoot discard it and warn.
container.innerHTML = "";

createRoot(container).render(<App />);
