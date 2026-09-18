import { useParams } from "react-router";

export function useEventId(): string {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Something went wrong");
  return id;
}
