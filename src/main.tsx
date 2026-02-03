import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/design-tokens.css";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(<App />);