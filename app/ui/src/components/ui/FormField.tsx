import { FlexBox, FormItem, Label, Text } from "@ui5/webcomponents-react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  errorId?: string;
  className?: string;
}
export default function FormField(props: FormFieldProps) {
  const { label, children, error, errorId, className } = props;

  return (
    <FormItem labelContent={<Label>{label}</Label>} className={className}>
      <FlexBox direction="Column">
        {children}
        {error && errorId && (
          <Text id={errorId} className="field-error-text">
            {error}
          </Text>
        )}
      </FlexBox>
    </FormItem>
  );
}
