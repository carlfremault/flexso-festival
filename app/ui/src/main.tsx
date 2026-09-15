import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { ThemeProvider } from "@ui5/webcomponents-react";

import App from "./App";

import "@ui5/webcomponents-react/dist/Assets.js";
import "@fundamental-styles/common-css/dist/sap-flex.css";
import "./index.css";

setTheme("sap_horizon");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename="/ui">
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
