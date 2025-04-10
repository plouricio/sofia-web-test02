import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Cuarteles from "./pages/Cuarteles";
import DynamicFormExample from "./pages/DynamicFormExample";
import FormBuilderExample from "./pages/FormBuilderExample";
import routes from "tempo-routes";

function App() {
  return (
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
  );

export default App;
