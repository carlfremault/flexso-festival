import { BusyIndicator, FlexBox } from "@ui5/webcomponents-react";

export default function CenteredBusyIndicator() {
  return (
    <FlexBox fitContainer justifyContent="Center" alignItems="Center">
      <BusyIndicator active size="M" />
    </FlexBox>
  );
}
