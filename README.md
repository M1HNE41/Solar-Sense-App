# Solar Sense App

**Real-time monitoring and analysis of solar panel performance**  
Developed by Mihnea Petcu Faculty of Electronics, Telecommunications and Information Technology, University POLITEHNICA of Bucharest.

---

## 📱 About the App
![image](https://github.com/user-attachments/assets/bceddf39-18e1-457d-a3a9-c8551b23e630)

Solar Sense is a mobile application developed using **React Native**, designed to monitor the energy production of small-scale photovoltaic systems (e.g., cabins, RVs, off-grid homes). It integrates with an **ESP32** microcontroller and an **INA219** current and voltage sensor to collect and transmit live energy data.

The app offers:
- Real-time monitoring of **voltage**, **current**, and **power**
- **Historical graph** visualization for energy statistics
- WiFi configuration for ESP32 devices
- Support for managing multiple devices
- Remote reset capability
- Persistent dark mode support
- Full integration with a backend via **HTTP** and **WebSocket**

---

## ⚙️ System Architecture

![image](https://github.com/user-attachments/assets/02ee072a-73d7-4c5b-a29b-582ffb00a2da)

The application has three main components:
- **ESP32 + INA219** hardware for data collection
- **Node.js backend server** hosted on Render
- **React Native mobile app** for real-time display and control

Data flow:
1. ESP32 collects sensor data and sends it to the server via HTTP POST
2. Mobile app fetches historical data using HTTP GET
3. Live updates are pushed via WebSocket

---

## 🔧 Features

- 📊 Live data display (voltage, current, power)
- 📈 Historical graphing by hour, day, week, month
- 🔌 WiFi configuration interface for ESP32 in AP mode
- 🔁 Remote device reset via MAC address
- 📡 WebSocket integration for real-time updates
- ⚙️ Device management (add/remove/rename)
- 🌙 Dark mode toggle with saved preferences
- 🔐 Device pairing by MAC address

---

## 💡 Improvements and Future Work

- OTA firmware updates for ESP32
- User account system with authentication
- Live data expansion (battery level, grid power, system efficiency)
- Push notifications for offline status or low energy
- UI/UX enhancements and iOS support

---

## 🛠 Tech Stack

- **React Native** / Expo
- **ESP32** with INA219 sensor
- **Node.js** + Express server
- **MongoDB Atlas**
- **Render.com** deployment

---

## 📄 License

This project is created for educational and demonstration purposes.
