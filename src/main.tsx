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
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

console.log("🚀 [main.tsx] Starting React application initialization");
console.log("🔍 [main.tsx] Current window location:", window.location.href);
console.log("🔍 [main.tsx] Current pathname:", window.location.pathname);

// Get base path from window location
const getBasePath = () => {
  console.log("🔄 [main.tsx] Calculating base path");
  console.log(
    "🔍 [main.tsx] Path segments:",
    window.location.pathname.split("/")
  );
  console.log("🔍 [main.tsx] Hostname:", window.location.hostname);

  // Since we're using GitHub Pages, we need to use the repository name as the base path
  const basePath = "/kodekenobi.github.io";
  console.log("✅ [main.tsx] Base path determined:", basePath);
  return basePath;
};

const basePath = getBasePath();
console.log("🔍 [main.tsx] Final Base Path for Router:", basePath);

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
    console.log("🔄 [ErrorBoundary] Initializing");
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("❌ [ErrorBoundary] Error caught:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("❌ [ErrorBoundary] Error details:", error);
    console.error(
      "❌ [ErrorBoundary] Component stack:",
      errorInfo.componentStack
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      console.log("⚠️ [ErrorBoundary] Rendering error state");
      return (
        <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    console.log("✅ [ErrorBoundary] Rendering children");
    return this.props.children;
  }
}

try {
  console.log("🔄 [main.tsx] Attempting to mount React application");
  const rootElement = document.getElementById("root");
  console.log("🔍 [main.tsx] Root element found:", !!rootElement);

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  console.log("✅ [main.tsx] Root created successfully");

  console.log("🔄 [main.tsx] Starting render process");
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

  console.log("✅ [main.tsx] React application initialized successfully");
} catch (error) {
  console.error("❌ [main.tsx] Critical error during initialization:", error);
  document.getElementById("root")!.innerHTML = `
    <div style="color: white; padding: 20px; text-align: center;">
      <h1>Failed to load application</h1>
      <pre>${error instanceof Error ? error.toString() : "Unknown error"}</pre>
    </div>
  `;
}
