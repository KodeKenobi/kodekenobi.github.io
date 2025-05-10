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
import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

console.log("🚀 main.tsx: Starting React application initialization");

// Get base path from window location
const getBasePath = () => {
  const pathSegments = window.location.pathname.split("/");
  if (pathSegments[1] === "kodekenobi.github.io") {
    return "/kodekenobi.github.io";
  }
  if (window.location.hostname === "kodekenobi.github.io") {
    return "/kodekenobi.github.io";
  }
  return "";
};

const basePath = getBasePath();
console.log("🔍 Detected Base Path for Router:", basePath);

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error boundary component
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("React Error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </StrictMode>
  );

  console.log("✅ main.tsx: React application initialized");
} catch (error) {
  console.error("❌ Error initializing React app:", error);
  document.getElementById("root")!.innerHTML = `
    <div style="color: white; padding: 20px; text-align: center;">
      <h1>Failed to load application</h1>
      <pre>${error instanceof Error ? error.toString() : "Unknown error"}</pre>
    </div>
  `;
}
