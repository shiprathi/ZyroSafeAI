import React, { useState } from "react";
import riderImage from "./assets/rider.png";

async function parseResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || "Invalid server response");
  }
}

function App() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    platform: "",
    zone: "",
    income: "",
    activeHours: "",
    triggerType: "rain"
  });

  const [riskResult, setRiskResult] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [claimResult, setClaimResult] = useState(null);
  const [claimType, setClaimType] = useState("");
  const [loading, setLoading] = useState(false);

  const plans = [
    { name: "Basic", premium: 29, features: "Standard disruption coverage" },
    { name: "Smart", premium: 49, features: "Weather + Traffic protection" },
    { name: "Pro", premium: 69, features: "Peak-hour multiplier + higher payout" }
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      city: "",
      platform: "",
      zone: "",
      income: "",
      activeHours: "",
      triggerType: "rain"
    });
    setRiskResult(null);
    setSelectedPlan(null);
    setClaimResult(null);
    setClaimType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerResponse = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const registerData = await parseResponse(registerResponse);

      if (!registerResponse.ok || !registerData.success) {
        throw new Error(registerData.message || "Registration failed");
      }

      let riskPayload = { rain: 60, traffic: 20, peakHour: 50 };

      if (formData.triggerType === "traffic") {
        riskPayload = { rain: 10, traffic: 85, peakHour: 50 };
      } else if (formData.triggerType === "flood") {
        riskPayload = { rain: 90, traffic: 60, peakHour: 60 };
      }

      const riskResponse = await fetch("/calculate-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(riskPayload)
      });

      const riskData = await parseResponse(riskResponse);

      if (!riskResponse.ok || !riskData.success) {
        throw new Error(riskData.message || "Risk calculation failed");
      }

      setRiskResult(riskData);
      setSelectedPlan(null);
      setClaimResult(null);
      setClaimType("");

      alert("Rider registered and risk calculated successfully");
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (plan) => {
    setLoading(true);

    try {
      const response = await fetch("/select-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          riderName: formData.name,
          city: formData.city,
          platform: formData.platform,
          zone: formData.zone,
          planName: plan.name,
          premium: plan.premium,
          features: plan.features
        })
      });

      const data = await parseResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Policy selection failed");
      }

      setSelectedPlan(plan);
      setClaimResult(null);
      setClaimType("");

      alert("Policy selected successfully");
    } catch (error) {
      console.error("PLAN ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTrigger = async (type) => {
    setLoading(true);
    setClaimType(type);

    try {
      let claimPayload = {
        active: true,
        locationMatch: true,
        duplicateClaim: false,
        avgIncome: Number(formData.income)
      };

      if (type === "location") {
        claimPayload = {
          active: true,
          locationMatch: false,
          duplicateClaim: false,
          avgIncome: Number(formData.income)
        };
      } else if (type === "duplicate") {
        claimPayload = {
          active: true,
          locationMatch: true,
          duplicateClaim: true,
          avgIncome: Number(formData.income)
        };
      }

      const response = await fetch("/process-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(claimPayload)
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Claim processing failed");
      }

      setClaimResult(data);
    } catch (error) {
      console.error("CLAIM ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getClaimLabel = () => {
    if (claimType === "genuine") return "Genuine Claim";
    if (claimType === "location") return "Location Mismatch";
    if (claimType === "duplicate") return "Duplicate Claim";
    return "-";
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.heroSection}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>🩵 ZyroSafe AI</h1>
            <p style={styles.heroSubtitle}>
              Hyperlocal Income Protection for Grocery Delivery Partners
            </p>
          </div>

          {/* Agar image use karni ho toh niche wala div hata ke img use karo */}
          <img src={riderImage} alt="Delivery Rider" style={styles.heroImage} />
        </div>

        <div style={styles.card}>
          <h1 style={styles.title}>📝 Rider Registration</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <select
              style={styles.input}
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              <option value="Blinkit">Blinkit</option>
              <option value="Zepto">Zepto</option>
            </select>

            <input
              style={styles.input}
              type="text"
              name="zone"
              placeholder="Working Zone"
              value={formData.zone}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="number"
              name="income"
              placeholder="Average Daily Income"
              value={formData.income}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="number"
              name="activeHours"
              placeholder="Active Hours Per Day"
              value={formData.activeHours}
              onChange={handleChange}
              required
            />

            <select
              style={styles.input}
              name="triggerType"
              value={formData.triggerType}
              onChange={handleChange}
              required
            >
              <option value="rain">🌧️ Heavy Rain</option>
              <option value="traffic">🚦 Traffic Jam</option>
              <option value="flood">🌊 Flood Alert</option>
            </select>

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Register & Calculate Risk"}
            </button>

            <button
              type="button"
              style={styles.resetButton}
              onClick={handleReset}
              disabled={loading}
            >
              Reset Demo
            </button>
          </form>

          {riskResult && (
            <div style={styles.resultBox}>
              <h2 style={styles.sectionTitle}>🌧️ Risk Assessment Result</h2>
              <p><strong>Selected Trigger:</strong> {formData.triggerType}</p>
              <p><strong>Risk Score:</strong> {riskResult.riskScore}</p>
              <p><strong>Risk Level:</strong> {riskResult.riskLevel}</p>
              <p><strong>Suggested Weekly Premium:</strong> ₹{riskResult.premium}</p>
            </div>
          )}

          {riskResult && (
            <div style={styles.planSection}>
              <h2 style={styles.sectionTitle}>🛡️ Select a Weekly Plan</h2>
              <div style={styles.planContainer}>
                {plans.map((plan, index) => (
                  <div key={index} style={styles.planCard}>
                    <h3>{plan.name}</h3>
                    <p><strong>₹{plan.premium}/week</strong></p>
                    <p>{plan.features}</p>
                    <button
                      type="button"
                      style={styles.planButton}
                      onClick={() => handlePlanSelect(plan)}
                      disabled={loading}
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPlan && (
            <div style={styles.selectedBox}>
              <h2 style={styles.sectionTitle}>🩵 Selected Policy & Prototype Simulation Controls</h2>
              <p><strong>Plan Name:</strong> {selectedPlan.name}</p>
              <p><strong>Weekly Premium:</strong> ₹{selectedPlan.premium}</p>
              <p><strong>Features:</strong> {selectedPlan.features}</p>

              <p style={styles.noteText}>
                Note: In the real system, claims are auto-triggered and validated by backend rules.
                These buttons are only prototype simulation controls.
              </p>

              <div style={styles.claimActions}>
                <button
                  type="button"
                  style={styles.claimButton}
                  onClick={() => handleClaimTrigger("genuine")}
                  disabled={loading}
                >
                  Process Genuine Claim
                </button>

                <button
                  type="button"
                  style={styles.claimButton}
                  onClick={() => handleClaimTrigger("location")}
                  disabled={loading}
                >
                  Simulate Location Mismatch
                </button>

                <button
                  type="button"
                  style={styles.claimButton}
                  onClick={() => handleClaimTrigger("duplicate")}
                  disabled={loading}
                >
                  Simulate Duplicate Claim
                </button>
              </div>
            </div>
          )}

          {claimResult && (
            <div
              style={{
                ...styles.claimBox,
                background: claimResult.success ? "#ecfdf5" : "#fef2f2",
                border: claimResult.success
                  ? "1px solid #86efac"
                  : "1px solid #fca5a5"
              }}
            >
              <h2 style={styles.sectionTitle}>💸 Claim Result</h2>
              <p><strong>Claim Type:</strong> {getClaimLabel()}</p>
              <p><strong>Status:</strong> {claimResult.success ? "Approved" : "Rejected"}</p>
              <p><strong>Message:</strong> {claimResult.message}</p>
              {claimResult.success && (
                <p><strong>Payout Credited:</strong> ₹{claimResult.payout}</p>
              )}
            </div>
          )}

          {(formData.name || riskResult || selectedPlan || claimResult) && (
            <div style={styles.infoBox}>
              <h3 style={{ marginTop: 0 }}>✨ Demo Flow</h3>
              <p>1. Register rider and calculate risk</p>
              <p>2. Select a weekly insurance plan</p>
              <p>3. Simulate a genuine or suspicious claim</p>
              <p>4. View approval/rejection and payout status</p>
            </div>
          )}

          {(formData.name || riskResult || selectedPlan || claimResult) && (
            <div style={styles.dashboardBox}>
              <h2 style={styles.sectionTitle}>📊 Rider Dashboard</h2>

              <div style={styles.dashboardGrid}>
                <div style={styles.dashboardCard}>
                  <h3>Rider Details</h3>
                  <p><strong>Name:</strong> {formData.name || "-"}</p>
                  <p><strong>City:</strong> {formData.city || "-"}</p>
                  <p><strong>Platform:</strong> {formData.platform || "-"}</p>
                  <p><strong>Zone:</strong> {formData.zone || "-"}</p>
                  <p><strong>Trigger:</strong> {formData.triggerType || "-"}</p>
                </div>

                <div style={styles.dashboardCard}>
                  <h3>Risk Summary</h3>
                  <p><strong>Risk Score:</strong> {riskResult ? riskResult.riskScore : "-"}</p>
                  <p><strong>Risk Level:</strong> {riskResult ? riskResult.riskLevel : "-"}</p>
                  <p><strong>Weekly Premium:</strong> {riskResult ? `₹${riskResult.premium}` : "-"}</p>
                </div>

                <div style={styles.dashboardCard}>
                  <h3>Selected Policy</h3>
                  <p><strong>Plan:</strong> {selectedPlan ? selectedPlan.name : "-"}</p>
                  <p><strong>Premium:</strong> {selectedPlan ? `₹${selectedPlan.premium}/week` : "-"}</p>
                  <p><strong>Features:</strong> {selectedPlan ? selectedPlan.features : "-"}</p>
                </div>

                <div style={styles.dashboardCard}>
                  <h3>Claim Status</h3>
                  <p><strong>Claim Type:</strong> {claimType ? getClaimLabel() : "-"}</p>
                  <p><strong>Status:</strong> {claimResult ? (claimResult.success ? "Approved" : "Rejected") : "-"}</p>
                  <p><strong>Message:</strong> {claimResult ? claimResult.message : "-"}</p>
                  <p><strong>Payout:</strong> {claimResult && claimResult.success ? `₹${claimResult.payout}` : "-"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef5ff 0%, #f8fbff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Arial, sans-serif",
    padding: "30px"
  },
  wrapper: {
    width: "100%",
    maxWidth: "1000px"
  },
  heroSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    background: "linear-gradient(135deg, #dceaff, #eef5ff)",
    padding: "28px",
    borderRadius: "24px",
    marginBottom: "28px",
    border: "1px solid #d6e5ff",
    boxShadow: "0 10px 24px rgba(91,141,239,0.08)"
  },
  heroText: {
    flex: 1
  },
  heroTitle: {
    margin: 0,
    fontSize: "36px",
    color: "#24436b"
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#4d6b95",
    marginTop: "8px",
    marginBottom: "10px"
  },
  heroDescription: {
    fontSize: "14px",
    color: "#5f7594",
    lineHeight: "1.6"
  },
  heroImage: {
    width: "180px",
    height: "180px",
    objectFit: "contain"
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    padding: "32px",
    borderRadius: "24px",
    width: "100%",
    boxShadow: "0 12px 30px rgba(91,141,239,0.12)",
    border: "1px solid #dceaff",
    backdropFilter: "blur(10px)"
  },
  title: {
    textAlign: "center",
    marginBottom: "22px",
    color: "#24436b",
    fontSize: "30px"
  },
  sectionTitle: {
    color: "#24436b",
    marginTop: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "500px",
    margin: "0 auto"
  },
  input: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d6e5ff",
    fontSize: "14px",
    background: "#f9fbff",
    color: "#24436b",
    outline: "none"
  },
  button: {
    background: "linear-gradient(135deg, #8bb8ff, #6e9fff)",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(122,167,255,0.25)"
  },
  resetButton: {
    background: "#e7eefc",
    color: "#4a5f7d",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600"
  },
  resultBox: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "16px",
    background: "#f6faff",
    border: "1px solid #d6e5ff",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 6px 18px rgba(91,141,239,0.06)"
  },
  planSection: {
    marginTop: "30px"
  },
  planContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "15px",
    flexWrap: "wrap"
  },
  planCard: {
    background: "#f9fbff",
    border: "1px solid #d8e6ff",
    borderRadius: "16px",
    padding: "20px",
    width: "220px",
    textAlign: "center",
    boxShadow: "0 8px 18px rgba(91,141,239,0.06)"
  },
  planButton: {
    marginTop: "12px",
    background: "#cfe3ff",
    color: "#24436b",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  },
  selectedBox: {
    marginTop: "30px",
    padding: "22px",
    borderRadius: "16px",
    background: "#eef6ff",
    border: "1px solid #cfe3ff",
    maxWidth: "650px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 8px 18px rgba(91,141,239,0.06)"
  },
  noteText: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: "1.5"
  },
  claimActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px"
  },
  claimButton: {
    background: "#dbeafe",
    color: "#24436b",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600"
  },
  claimBox: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "16px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 8px 18px rgba(91,141,239,0.06)"
  },
  infoBox: {
    marginTop: "25px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f0f7ff",
    border: "1px solid #cfe3ff",
    maxWidth: "650px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#355075"
  },
  dashboardBox: {
    marginTop: "35px",
    padding: "25px",
    borderRadius: "18px",
    background: "#eff6ff",
    border: "1px solid #cfe3ff",
    boxShadow: "0 10px 24px rgba(91,141,239,0.06)"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "15px"
  },
  dashboardCard: {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #dbeafe",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
  }
};

export default App;