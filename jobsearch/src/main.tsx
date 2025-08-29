import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/fonts/fonts/junicode.css";
import App from "./App.tsx";
import { UserProvider } from "./context/users.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/theme.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider initialTheme="dark">
      <UserProvider>
        <App />
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
