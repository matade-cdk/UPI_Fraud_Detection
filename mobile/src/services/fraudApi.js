import { API_BASE_URL } from "./apiConfig";
import { getAuthToken } from "./authApi";

function authHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, timeoutId };
}

export async function assessTransactionRisk(payload) {
  const { controller, timeoutId } = withTimeout(3500);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ml/predict`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Fraud API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      source: "api",
      risky: data.riskLevel === "HIGH" || Number(data.riskScore || 0) >= 0.8,
      riskLevel: data.riskLevel || "LOW",
      riskScore: Number(data.riskScore || 0),
      reason: Array.isArray(data.reasons) && data.reasons.length
        ? data.reasons.join(", ")
        : "Model flagged this transaction as potentially suspicious.",
      raw: data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    const amount = Number(payload.amount || 0);
    const trustScore = Number(payload.trustScore || 0);
    const highAmount = amount >= 5000;
    const lowTrust = trustScore < 45;
    const risky = highAmount || lowTrust;

    const localReason = highAmount && lowTrust
      ? "High transfer amount to a low-trust recipient."
      : highAmount
        ? "Amount is unusually high compared to typical UPI behavior."
        : lowTrust
          ? "Recipient has a low trust score from prior transaction patterns."
          : "No high-risk pattern found locally.";

    return {
      source: "local_fallback",
      risky,
      riskLevel: risky ? "HIGH" : "LOW",
      riskScore: risky ? 0.86 : 0.18,
      reason: localReason,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function fetchRecentTransactions(limit = 20) {
  const { controller, timeoutId } = withTimeout(4500);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/transactions/me?page=1&limit=${limit}`, {
      method: "GET",
      headers: authHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Transactions API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    clearTimeout(timeoutId);
    return [];
  }
}

export async function saveTransaction(payload) {
  const { controller, timeoutId } = withTimeout(4500);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/transactions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Save transaction failed: ${response.status}`);
    }

    return { ok: true };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}