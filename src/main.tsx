import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        fontWeight: "bold",
      }}
    >
      Hello World
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
