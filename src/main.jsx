import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          duration: 3000,
          style: { background: "#22c55e", color: "#fff" },
        },
        error: {
          duration: 4000,
          style: { background: "#ef4444", color: "#fff" },
        },
      }}
    />
  </StrictMode>
);
