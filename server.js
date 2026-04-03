const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let riders = [];
let policies = [];
let claims = [];

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/register", (req, res) => {
  const { name, city, platform, zone, income, activeHours } = req.body;

  if (!name || !city || !platform || !zone || !income || !activeHours) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const rider = {
    id: riders.length + 1,
    name,
    city,
    platform,
    zone,
    income: Number(income),
    activeHours: Number(activeHours)
  };

  riders.push(rider);

  res.json({
    success: true,
    message: "Rider registered successfully",
    rider
  });
});

app.post("/calculate-risk", (req, res) => {
  const { rain, traffic, peakHour } = req.body;

  const riskScore = rain * 0.4 + traffic * 0.4 + peakHour * 0.2;

  let riskLevel = "Low";
  let premium = 29;

  if (riskScore > 40 && riskScore <= 70) {
    riskLevel = "Medium";
    premium = 49;
  } else if (riskScore > 70) {
    riskLevel = "High";
    premium = 69;
  }

  res.json({
    success: true,
    riskScore: riskScore.toFixed(2),
    riskLevel,
    premium
  });
});

app.post("/select-policy", (req, res) => {
  const { riderName, city, platform, zone, planName, premium, features } = req.body;

  if (!riderName || !city || !platform || !zone || !planName || !premium || !features) {
    return res.status(400).json({
      success: false,
      message: "Incomplete policy data"
    });
  }

  const policy = {
    id: policies.length + 1,
    riderName,
    city,
    platform,
    zone,
    planName,
    premium,
    features
  };

  policies.push(policy);

  res.json({
    success: true,
    message: "Policy selected successfully",
    policy
  });
});

app.post("/process-claim", (req, res) => {
  const { active, locationMatch, duplicateClaim, avgIncome } = req.body;

  if (!active) {
    return res.json({
      success: false,
      message: "Claim rejected: Rider is not active"
    });
  }

  if (!locationMatch) {
    return res.json({
      success: false,
      message: "Claim rejected: Location mismatch"
    });
  }

  if (duplicateClaim) {
    return res.json({
      success: false,
      message: "Claim rejected: Duplicate claim detected"
    });
  }

  const safeIncome = Number(avgIncome) || 0;
  const payout = Math.round((safeIncome / 8) * 2 * 1.5);

  claims.push({
    id: claims.length + 1,
    success: true,
    payout
  });

  res.json({
    success: true,
    message: "Claim approved successfully",
    payout
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});