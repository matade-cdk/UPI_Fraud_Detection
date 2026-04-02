const express = require("express");

const { predictRisk } = require("../controllers/ml.controller");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/predict-public", predictRisk);
router.post("/predict", requireAuth, predictRisk);

module.exports = router;
