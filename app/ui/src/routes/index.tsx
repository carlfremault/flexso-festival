import { Navigate, Route, Routes } from "react-router";

import Layout from "@/components/layout/Layout";
import { useUser } from "@/components/layout/UserProvider";
import Artists from "@/components/pages/Artists";
import EventsCreate from "@/components/pages/EventsCreate";
import EventsDetailsUsers from "@/components/pages/EventsDetailsUsers";
import EventsEdit from "@/components/pages/EventsEdit";
import EventsOverviewAdmins from "@/components/pages/EventsOverviewAdmins";
import EventsOverviewUsers from "@/components/pages/EventsOverviewUsers";

export default function AppRoutes() {
  const { isAdmin } = useUser();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/events">
          <Route index element={isAdmin ? <EventsOverviewAdmins /> : <EventsOverviewUsers />} />
          <Route
            path="new"
            element={isAdmin ? <EventsCreate /> : <Navigate to="/events" replace />}
          />
          <Route path=":id" element={isAdmin ? <EventsEdit /> : <EventsDetailsUsers />} />
        </Route>

        {isAdmin && <Route path="/artists" element={<Artists />} />}
      </Route>

      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
