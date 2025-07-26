import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/users.tsx";
import { ThemeProvider } from "./context/theme.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider initialTheme="dark">
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
