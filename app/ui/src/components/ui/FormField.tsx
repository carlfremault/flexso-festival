import { FlexBox, FormItem, Label, Text } from "@ui5/webcomponents-react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  errorId?: string;
  className?: string;
}

export default function FormField(props: FormFieldProps) {
  const { label, children, required, error, errorId, className } = props;

  return (
    <FormItem labelContent={<Label required={required}>{label}</Label>} className={className}>
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
