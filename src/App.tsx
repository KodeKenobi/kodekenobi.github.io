import { useEffect } from "react";

console.log("🚀 [App.tsx] Component module loaded");

function App() {
  console.log("🔄 [App.tsx] Component rendering");

  useEffect(() => {
    console.log("✅ [App.tsx] Component mounted");
    return () => {
      console.log("👋 [App.tsx] Component unmounting");
    };
  }, []);

  console.log("🎨 [App.tsx] Rendering component JSX");
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
      }}
    >
      HELLO WORLD
    </div>
  );
}

export default App;
