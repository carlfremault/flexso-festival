export interface SapMessage {
  code: string;
  message: string;
}

export const parseSapMessages = (res: Response): SapMessage[] => {
  try {
    return JSON.parse(res.headers.get("sap-messages") ?? "[]");
  } catch {
    return [];
  }
};
