import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App.jsx";
import "./index.css";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primeflex/themes/primeone-dark.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
