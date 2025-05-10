import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Home from "./components/Home.tsx";
import About from "./components/AboutPage.tsx";
import SkillsPage from "./components/SkillsPage.tsx";
import ProjectsPage from "./components/ProjectsPage.tsx";
import NusuruPage from "./components/NusuruPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/nusuru" element={<NusuruPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
