import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import SprLayout from "./components/layout/SprLayout"
import SimulasiPage from "./pages/SimulasiPage"
import SprPage from "./pages/SprPage"
import SelesaiPage from "./pages/SelesaiPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SprLayout />}>
          <Route path="/" element={<Navigate to="/simulasi" replace />} />
          <Route path="/simulasi" element={<SimulasiPage />} />
          <Route path="/spr" element={<SprPage />} />
          <Route path="/selesai" element={<SelesaiPage />} />
          <Route path="*" element={<Navigate to="/simulasi" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
