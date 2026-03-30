import { API_BASE_URL } from "./apiConfig";

let authToken = null;

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, timeoutId };
}

function mapRequestError(error, fallback) {
  const message = error instanceof Error ? error.message : fallback;
  const isAborted =
    (error instanceof Error && error.name === "AbortError") ||
    /aborted|aborterror/i.test(message);

  if (isAborted) {
    return `Request aborted due to timeout. Backend/API may be slow or unreachable at ${API_BASE_URL}.`;
  }

  if (/Network request failed/i.test(message)) {
    return `Network request failed. Check backend is running and API URL ${API_BASE_URL} is reachable from device.`;
  }

  return message;
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export function setAuthToken(token) {
  authToken = token || null;
}

export function getAuthToken() {
  return authToken;
}

export async function signupUser(payload) {
  const { controller, timeoutId } = withTimeout(20000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message || "Signup failed" };
    }

    return { ok: true, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    return { ok: false, error: mapRequestError(error, "Signup failed") };
  }
}

export async function loginUser(payload) {
  const { controller, timeoutId } = withTimeout(20000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message || "Login failed" };
    }

    return { ok: true, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    return { ok: false, error: mapRequestError(error, "Login failed") };
  }
}

export async function fetchMe() {
  const { controller, timeoutId } = withTimeout(15000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: jsonHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message || "Failed to fetch profile" };
    }

    return { ok: true, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    return { ok: false, error: mapRequestError(error, "Failed to fetch profile") };
  }
}
