import { API_BASE_URL } from "./apiConfig";
import { getAuthToken } from "./authApi";

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, timeoutId };
}

export async function sendChatMessage(message) {
  const token = getAuthToken();
  const { controller, timeoutId } = withTimeout(25000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message || data?.error || "Chat request failed" };
    }

    return { ok: true, reply: data.reply || "No response" };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Chat request failed",
    };
  }
}
