# 🌱 IoT-Based Smart Farming System

An intelligent and real-time farm monitoring solution using Firebase to simulate sensor data. This system helps farmers track essential environmental parameters such as temperature, humidity, soil moisture, and rainfall to make informed decisions for improved crop productivity.

---

## 📌 Project Overview

The Smart Farming System is built to demonstrate how IoT and cloud technologies can be leveraged to monitor agricultural fields remotely. This system simulates real-time environmental conditions using Firebase as a cloud database and provides users with a dashboard to visualize data trends over time.

---

## 🧩 Features

- 📡 **Real-time Sensor Data Simulation** using Firebase
- 🌦️ 24-hour environment data visualization
- 🌱 Monitor:
  - Temperature
  - Humidity
  - Soil Moisture
  - Rainfall
- 📊 Firebase Realtime Database Integration
- 📁 Modular and Scalable Design

## ⚙️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend/Cloud:** Firebase Realtime Database
- **Simulated Sensors:** JSON payloads (custom)
- **Optional**: Python scripts for simulation automation

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-farming-system.git
cd smart-farming-system
2. Setup Firebase
Go to Firebase Console

Create a new project

Set up Realtime Database and enable it

Get your configuration object from Firebase settings

Paste it into your JavaScript file (firebaseConfig object)

3. Run the Project
Open index.html in your browser.

To simulate data:

Use the included script (or manually push sample data to Firebase)

Observe changes reflected in your dashboard

📈 Sample Firebase Data Structure
json
Copy
Edit
{
  "smart_farming": {
    "environment": {
      "temperature": 26,
      "humidity": 70,
      "soil_moisture": 55,
      "rainfall": 3.4
    }
  }
}





## 🤝 Acknowledgments
This project was built for academic and prototyping purposes. Inspired by real-world challenges faced by farmers and the growing need for sustainable agri-tech solutions.
