import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RepDetail from "./components/RepDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rep/:repId" element={<RepDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
