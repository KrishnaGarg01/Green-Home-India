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
          background: "rgba(15, 23, 42, 0.92)",
          color: "#f8fafc",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          border: "1px solid rgba(134, 239, 172, 0.18)",
          boxShadow: "0 20px 40px -24px rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(12px)",
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
