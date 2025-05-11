import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./components/Home";
import SkillsPage from "./components/SkillsPage";
import NusuruPage from "./components/NusuruPage";
import About from "./components/sections/About";
import ProjectsPage from "./components/ProjectsPage";

console.log("🚀 [main.tsx] Application initializing");

// Get the base path for GitHub Pages
const basePath = import.meta.env.BASE_URL || "/";

console.log("🔍 [main.tsx] Base path:", basePath);

const rootElement = document.getElementById("root");
console.log("🔍 [main.tsx] Root element:", rootElement);

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
console.log("✅ [main.tsx] React root created");

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/nusuru" element={<NusuruPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
