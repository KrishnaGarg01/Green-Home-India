import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#f9fafb",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#f9fafb" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#f9fafb" },
        },
      }}
    />
  </StrictMode>
);
