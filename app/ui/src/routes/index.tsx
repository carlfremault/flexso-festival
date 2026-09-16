import { Navigate, Route, Routes } from "react-router";

import Layout from "../components/layout/Layout";
import Artists from "../components/pages/Artists";
import Events from "../components/pages/Events";

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
