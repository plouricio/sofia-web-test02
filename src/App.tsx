import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Cuarteles from "./pages/Cuarteles";
import DynamicFormExample from "./pages/DynamicFormExample";
import FormBuilderExample from "./pages/FormBuilderExample";
import routes from "tempo-routes";
import Sidebar from "./components/layout/Sidebar";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <main className="flex-1 transition-all duration-300 overflow-auto">
        <Suspense fallback={<p>Loading...</p>}>
          <>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cuarteles" element={<Cuarteles />} />
              <Route path="/dynamic-form" element={<DynamicFormExample />} />
              <Route path="/form-builder" element={<FormBuilderExample />} />
              {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
            </Routes>
          </>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
