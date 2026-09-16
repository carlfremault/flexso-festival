import { Navigate, Route, Routes } from "react-router";

import Layout from "../components/layout/Layout";
import Artists from "../components/pages/Artists";
import EventsCreate from "../components/pages/EventsCreate";
import EventsOverview from "../components/pages/EventsOverview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<Navigate to="/events" replace />} />
        <Route path="/events">
          <Route index element={<EventsOverview />} />
          <Route path="new" element={<EventsCreate />} />
        </Route>
        <Route path="/artists" element={<Artists />} />
      </Route>
    </Routes>
  );
}
