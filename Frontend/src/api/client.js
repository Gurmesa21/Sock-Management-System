const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const TOKEN_KEY = "stock_management_access_token";
const SESSION_KEY = "stock_management_session";
const REMEMBER_KEY = "stock_management_remember";

export function getAccessToken() {
  const direct =
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  if (direct) return direct;

  try {
    const session = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(REMEMBER_KEY) ||
      "null"
    );
    if (session?.token) return session.token;
  } catch {
    // ignore malformed storage values
  }

  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth?.token || auth?.accessToken) return auth.token || auth.accessToken;
  } catch {
    // ignore malformed storage values
  }

  return null;
}

export function setAccessToken(token, remember = false) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("auth");
}

export function buildUrl(path, query) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

export function withAuthHeader(token, headers = {}) {
  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

export function normalizeApiResponse(payload) {
  if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload;
  }

  return { success: true, data: payload };
}

export async function apiFetch(path, { method = "GET", body, query, signal, headers = {} } = {}) {
  const token = getAccessToken();
  const requestHeaders = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...withAuthHeader(token, headers),
  };

  const response = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    clearAccessToken();
    window.dispatchEvent(new CustomEvent("stock-management:unauthorized"));
  }

  if (!response.ok) {
    const errorMessage = payload?.error?.message || payload?.message || `Request failed with HTTP ${response.status}.`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = payload?.error?.details;
    throw error;
  }

  return normalizeApiResponse(payload);
}

export async function apiRequest(path, options = {}) {
  return apiFetch(path, options);
}

export const api = {
  get: (p, q, o) => apiFetch(p, { ...o, query: q }),
  post: (p, b, o) => apiFetch(p, { ...o, method: "POST", body: b }),
  patch: (p, b, o) => apiFetch(p, { ...o, method: "PATCH", body: b }),
  put: (p, b, o) => apiFetch(p, { ...o, method: "PUT", body: b }),
  delete: (p, o) => apiFetch(p, { ...o, method: "DELETE" }),
};
