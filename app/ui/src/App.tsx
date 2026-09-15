import { Link, Navigate, Route, Routes } from "react-router";

import Artists from "./pages/Artists";
import Events from "./pages/Events";

export default function App() {
  return (
    <div className="sap-flex sap-flex--column sap-flex--gap-medium">
      <nav className="sap-flex sap-flex--gap-small">
        <Link to="/events">Events</Link>
        <Link to="/artists">Artists</Link>
      </nav>

      <Routes>
        <Route path="*" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<Events />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
    </div>
  );
}
