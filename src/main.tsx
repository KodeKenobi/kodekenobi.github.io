import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("🚀 [main.tsx] Application initializing");

const rootElement = document.getElementById("root");
console.log("🔍 [main.tsx] Root element:", rootElement);

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
console.log("✅ [main.tsx] React root created");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
