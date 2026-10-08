const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "");

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
    // ignore
  }

  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth?.token || auth?.accessToken) return auth.token || auth.accessToken;
  } catch {
    // ignore
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

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    params,
    query,
    headers = {},
    signal,
    preserveMeta = false,
  } = options;

  const token = getAccessToken();
  const queryParams = params || query || {};
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(
    `${API_BASE_URL}${normalizedPath}${buildQuery(queryParams)}`,
    {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
    }
  );

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (response.status === 401) {
    clearAccessToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("stock-management:unauthorized"));
    }
  }

  if (!response.ok || payload?.success === false) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with HTTP ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload?.error?.details || payload?.details;
    throw error;
  }

  if (preserveMeta) return payload;
  return payload?.data !== undefined ? payload.data : payload;
}

export async function apiFetch(path, options = {}) {
  return request(path, { ...options, preserveMeta: true });
}

export const api = {
  get: (path, params, options = {}) => request(path, { ...options, method: "GET", params }),
  post: (path, body, options = {}) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: "PATCH", body }),
  put: (path, body, options = {}) => request(path, { ...options, method: "PUT", body }),
  delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
  request,
  apiFetch,
  buildQuery,
};

export default api;
