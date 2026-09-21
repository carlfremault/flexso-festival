import { Navigate, Route, Routes } from "react-router";

import Layout from "@/components/layout/Layout";
import { useUser } from "@/components/layout/UserProvider";
import ArtistsAdd from "@/components/pages/ArtistsAdd";
import ArtistsOverviewAdmins from "@/components/pages/ArtistsOverviewAdmins";
import ArtistsOverviewUsers from "@/components/pages/ArtistsOverviewUsers";
import EventsCreateAdmin from "@/components/pages/EventsCreateAdmin";
import EventsDetailsUsers from "@/components/pages/EventsDetailsUsers";
import EventsEditAdmin from "@/components/pages/EventsEditAdmin";
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
            element={isAdmin ? <EventsCreateAdmin /> : <Navigate to="/events" replace />}
          />
          <Route path=":id" element={isAdmin ? <EventsEditAdmin /> : <EventsDetailsUsers />} />
        </Route>

        <Route path="/artists">
          <Route index element={isAdmin ? <ArtistsOverviewAdmins /> : <ArtistsOverviewUsers />} />
          <Route path="new" element={<ArtistsAdd />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
