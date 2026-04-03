# 🩵 ZyroSafe AI

**Hyperlocal Income Protection for Grocery Delivery Partners**

ZyroSafe AI is an AI-powered parametric insurance prototype designed to protect grocery delivery riders (Blinkit / Zepto) from **unexpected income loss** caused by real-world disruptions like heavy rainfall, traffic congestion, and flood alerts.

---

## 🚀 Problem Statement

Delivery riders face unpredictable income loss due to external disruptions.
Existing insurance solutions do not cover **short-term income instability**.

⚠️ This solution focuses **ONLY on income loss**
❌ It does NOT cover health, life, or vehicle insurance

---

## 💡 What ZyroSafe AI Does

* Registers riders with basic details
* Calculates **risk score dynamically**
* Suggests **weekly insurance premiums**
* Allows users to select plans (Basic / Smart / Pro)
* Simulates **claim processing**
* Detects **fraud cases**:

  * Location mismatch
  * Duplicate claims
* Displays full **Rider Dashboard**

---

## 🧠 Core Features

### ✅ Rider Registration

* Name, city, platform, zone
* Income & active hours

### 🌧️ Risk Engine

* Trigger-based:

  * Heavy Rain
  * Traffic Jam
  * Flood Alert

**Formula:**

$$
Risk = 0.4 \cdot Rain + 0.4 \cdot Traffic + 0.2 \cdot PeakHour
$$

### 💸 Weekly Premium Plans

* Basic – ₹29/week
* Smart – ₹49/week
* Pro – ₹69/week

### 🛡️ Claim Processing

* Genuine claims → Approved ✅
* Fraud detection:

  * Location mismatch ❌
  * Duplicate claims ❌

### 📊 Rider Dashboard

* Rider details
* Risk profile
* Selected policy
* Claim status

---

## 🧑‍💻 Tech Stack

**Frontend:** React.js, Custom CSS (Pastel UI)
**Backend:** Node.js, Express.js
**Other:** REST APIs, JSON-based data flow

---

## 🏗️ Project Structure

```
zyrosafe-ai/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── assets/
│   │
│   ├── public/
│   ├── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ How to Run Locally

### 1. Clone Repository

```
git clone https://github.com/your-username/zyrosafe-ai.git
cd zyrosafe-ai
```

### 2. Start Backend

```
cd backend
npm install
npm run dev
```

Backend runs on:
http://localhost:5001

### 3. Start Frontend

```
cd frontend
npm install
npm start
```

Frontend runs on:
http://localhost:3000

---

## 🎥 Demo Flow

1. Register rider
2. Select disruption trigger
3. View risk score & premium
4. Choose weekly plan
5. Simulate claim:

   * Genuine → Approved
   * Fraud → Rejected
6. View dashboard

---

## ⚠️ Important Notes

* Claims are **auto-triggered in real systems**
* Buttons are added only for **prototype simulation**
* Weekly pricing aligns with gig worker income cycles

---

## 🏆 Accomplishments

* Built complete end-to-end working prototype
* Implemented risk-based premium system
* Designed fraud detection logic
* Created aesthetic UI with dashboard
* Simulated real-world insurance flow

---

## 📚 What We Learned

* Parametric insurance systems
* Full-stack development (React + Node)
* API integration
* Fraud detection logic
* UI/UX design

---

## 🔮 What’s Next

* Real-time APIs (weather, traffic)
* GPS-based validation
* Admin approval dashboard
* Payment integration
* User authentication

---

## 🤝 Team

Team Avengers 🚀

---

## ❤️ Final Note

ZyroSafe AI aims to bring **financial stability to gig workers**
through simple, fast, and intelligent insurance solutions.
