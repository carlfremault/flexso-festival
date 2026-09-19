import { memo, Suspense, useCallback, useState } from "react";
import { Button, Panel, Title, Toolbar, ToolbarSpacer } from "@ui5/webcomponents-react";

import CenteredBusyIndicator from "@/components/ui/CenteredBusyIndicator";

import type { PersistedUserTimeslot } from "../types";

import TimeslotFormDialog from "./TimeslotFormDialog";
import TimeslotsTable from "./TimeslotsTable";

import "./TimeslotsView.css";

type DialogState =
  { mode: "create"; timeslot: null } | { mode: "edit"; timeslot: PersistedUserTimeslot } | null;

function TimeslotsView() {
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const handleEditTimeslot = useCallback((timeslot: PersistedUserTimeslot) => {
    setDialogState({ mode: "edit", timeslot });
  }, []);

  return (
    <Panel
      className="timeslots-panel"
      fixed
      header={
        <Toolbar design="Transparent">
          <Title level="H2">Timeslots</Title>
          <ToolbarSpacer />
          <Button
            design="Emphasized"
            onClick={() => setDialogState({ mode: "create", timeslot: null })}
          >
            New Timeslot
          </Button>
        </Toolbar>
      }
    >
      <Suspense fallback={<CenteredBusyIndicator />}>
        <TimeslotsTable onEdit={handleEditTimeslot} />
      </Suspense>
      <TimeslotFormDialog
        open={dialogState !== null}
        timeslot={dialogState?.timeslot ?? undefined}
        onClose={() => setDialogState(null)}
      />
    </Panel>
  );
}

export default memo(TimeslotsView);
