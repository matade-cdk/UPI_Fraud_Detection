const MODEL_COLUMNS = [
  "step",
  "amount",
  "oldbalanceOrg",
  "newbalanceOrig",
  "oldbalanceDest",
  "newbalanceDest",
  "type_CASH_IN",
  "type_CASH_OUT",
  "type_DEBIT",
  "type_PAYMENT",
  "type_TRANSFER",
  "errorBalanceOrg",
  "errorBalanceDest",
];

const KNOWN_TYPES = ["CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"];

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function buildFeatureVector(body) {
  const amount = toNumber(body.amount);
  const oldbalanceOrg = toNumber(body.oldbalanceOrg);
  const oldbalanceDest = toNumber(body.oldbalanceDest);
  const transactionType = String(body.transactionType || body.type || "TRANSFER").toUpperCase();
  const normalizedType = KNOWN_TYPES.includes(transactionType) ? transactionType : "TRANSFER";

  const newbalanceOrig = body.newbalanceOrig !== undefined
    ? toNumber(body.newbalanceOrig)
    : oldbalanceOrg - amount;

  const newbalanceDest = body.newbalanceDest !== undefined
    ? toNumber(body.newbalanceDest)
    : oldbalanceDest + amount;

  const errorBalanceOrg = body.errorBalanceOrg !== undefined
    ? toNumber(body.errorBalanceOrg)
    : amount - (oldbalanceOrg - newbalanceOrig);

  const errorBalanceDest = body.errorBalanceDest !== undefined
    ? toNumber(body.errorBalanceDest)
    : amount - (newbalanceDest - oldbalanceDest);

  return {
    step: clamp(toNumber(body.step), 0, 999999),
    amount: clamp(amount, 0, 1e12),
    oldbalanceOrg: clamp(oldbalanceOrg, 0, 1e12),
    newbalanceOrig: clamp(newbalanceOrig, -1e12, 1e12),
    oldbalanceDest: clamp(oldbalanceDest, 0, 1e12),
    newbalanceDest: clamp(newbalanceDest, -1e12, 1e12),
    type_CASH_IN: normalizedType === "CASH_IN" ? 1 : 0,
    type_CASH_OUT: normalizedType === "CASH_OUT" ? 1 : 0,
    type_DEBIT: normalizedType === "DEBIT" ? 1 : 0,
    type_PAYMENT: normalizedType === "PAYMENT" ? 1 : 0,
    type_TRANSFER: normalizedType === "TRANSFER" ? 1 : 0,
    errorBalanceOrg,
    errorBalanceDest,
    transactionType: normalizedType,
  };
}

function evaluateRisk(features) {
  let riskScore = 0.06;
  const reasons = [];

  if (features.amount >= 20000) {
    riskScore += 0.3;
    reasons.push("High transfer amount");
  }

  if (features.amount >= 100000) {
    riskScore += 0.2;
    reasons.push("Very high amount compared with typical UPI transfers");
  }

  if (features.oldbalanceOrg < features.amount) {
    riskScore += 0.35;
    reasons.push("Amount exceeds sender balance");
  }

  if (features.type_TRANSFER || features.type_CASH_OUT) {
    riskScore += 0.12;
  }

  if (Math.abs(features.errorBalanceOrg) > 1) {
    riskScore += 0.16;
    reasons.push("Sender balance delta mismatch");
  }

  if (Math.abs(features.errorBalanceDest) > 1) {
    riskScore += 0.16;
    reasons.push("Receiver balance delta mismatch");
  }

  if (features.oldbalanceDest === 0 && features.newbalanceDest > 50000) {
    riskScore += 0.14;
    reasons.push("Receiver account jumped from zero to large value");
  }

  if (features.step >= 0 && features.step <= 5) {
    riskScore += 0.06;
  }

  const finalScore = clamp(Number(riskScore.toFixed(4)), 0, 0.9999);
  const riskLevel = finalScore >= 0.8 ? "HIGH" : finalScore >= 0.5 ? "MEDIUM" : "LOW";

  return {
    riskScore: finalScore,
    riskLevel,
    anomaly: finalScore >= 0.5,
    reasons: reasons.length ? reasons : ["No suspicious pattern detected"],
  };
}

async function predictRisk(req, res) {
  try {
    const features = buildFeatureVector(req.body || {});
    const risk = evaluateRisk(features);

    return res.json({
      ...risk,
      modelColumns: MODEL_COLUMNS,
      featuresUsed: MODEL_COLUMNS.reduce((acc, key) => {
        acc[key] = features[key];
        return acc;
      }, {}),
      transactionType: features.transactionType,
    });
  } catch (error) {
    return res.status(500).json({ message: "Prediction failed", error: error.message });
  }
}

module.exports = { predictRisk, MODEL_COLUMNS };
