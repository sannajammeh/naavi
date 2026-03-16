import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";
import { Store } from "./Store.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

const page = window.location.hash === "#store" ? <Store /> : <App />;
createRoot(root).render(page);
