import { parseODataError } from "./parseODataError";
import { parseSapMessages, type SapMessage } from "./parseSapMessages";

type Service = "admin" | "user";

type RequestParams = {
  service: Service;
  path: string;
  init?: RequestInit;
  errorMessage?: string;
};

let csrfToken: string | null = null;
let csrfChecked = false;

const fetchCsrfToken = async (): Promise<string | null> => {
  const res = await fetch("/user/", { headers: { "x-csrf-token": "fetch" } });
  return res.headers.get("x-csrf-token");
};

const request = async (params: RequestParams): Promise<Response> => {
  const { service, path, init = {}, errorMessage } = params;
  const method = init.method ?? "GET";
  const headers = new Headers(init.headers);

  if (method !== "GET") {
    if (!csrfChecked) {
      csrfToken = await fetchCsrfToken();
      csrfChecked = true;
    }
    if (csrfToken) headers.set("x-csrf-token", csrfToken);
  }

  let res = await fetch(`/${service}${path}`, { ...init, headers });

  // tokens expire with the session — refetch once and retry
  if (res.status === 403 && res.headers.get("x-csrf-token") === "Required") {
    csrfToken = await fetchCsrfToken();
    if (csrfToken) headers.set("x-csrf-token", csrfToken);
    res = await fetch(`/${service}${path}`, { ...init, headers });
  }

  if (!res.ok) {
    throw await parseODataError(res, errorMessage ?? `Request failed (${res.status})`);
  }

  return res;
};

const parseBody = async <T>(res: Response): Promise<T> =>
  (res.status === 204 ? undefined : await res.json()) as T;

export const apiFetch = async <T>(params: RequestParams): Promise<T> =>
  parseBody<T>(await request(params));

export const apiFetchWithMessages = async <T>(
  params: RequestParams,
): Promise<{ data: T; messages: SapMessage[] }> => {
  const res = await request(params);
  return { data: await parseBody<T>(res), messages: parseSapMessages(res) };
};
