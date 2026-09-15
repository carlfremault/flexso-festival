import { Navigate, Route, Routes } from "react-router";

import Layout from "../components/Layout";
import Artists from "../pages/Artists";
import Events from "../pages/Events";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<Events />} />
        <Route path="/artists" element={<Artists />} />
      </Route>
    </Routes>
  );
}
