# 🌐 Internet of Things (IoT)

![IoT Architecture](../../../assets/images/placeholder-iot-architecture.jpg)
*🖼️ Tìm kiếm: "IoT architecture diagram cloud sensors" - Kiến trúc hệ thống IoT*

{{youtube:LlhmzVL5bm8|What is IoT}}

*🎥 Video: "IoT Explained" - IoT là gì và hoạt động như thế nào*

## Giới thiệu

**IoT = Embedded + Internet**

IoT là **hệ thần kinh** kết nối thiết bị với Internet. Thiết bị, thông tin từ sensors, điều khiển actuators được kết nối Internet, đưa lên Cloud, hiển thị trên App/Web để người dùng kiểm tra và điều khiển từ xa.

---

## 📚 Kiến thức cần học

### 1. Giao thức IoT

#### MQTT (Message Queuing Telemetry Transport) - PHỔ BIẾN NHẤT

**Tại sao MQTT?**
- ✅ Lightweight, tiết kiệm bandwidth
- ✅ Publish/Subscribe pattern
- ✅ QoS (Quality of Service) levels
- ✅ Retain messages
- ✅ Last Will and Testament

**Kiến trúc:**
```
[Device 1] ----Publish---->  [MQTT Broker]  ----Subscribe----> [Dashboard]
[Device 2] ----Publish---->       ↕                              
[Device 3] <---Subscribe---   [Mobile App] <---Subscribe----
```

**QoS Levels:**
- **QoS 0:** At most once (fire and forget) - Nhanh nhất
- **QoS 1:** At least once - Đảm bảo nhận được
- **QoS 2:** Exactly once - Chậm nhất nhưng tin cậy nhất

**MQTT Brokers:**
- **Mosquitto:** Open-source, self-hosted
- **HiveMQ:** Cloud & self-hosted
- **EMQX:** High-performance, scalable
- **CloudMQTT:** Hosted service

**Topics structure:**
```
home/living-room/temperature
home/living-room/humidity
home/bedroom/light/status
home/bedroom/light/command
```

{{youtube:ez-ifrhXUoc|MQTT Tutorial}}

*🎥 Video: "MQTT Explained" - MQTT hoạt động như thế nào*

#### HTTP/HTTPS REST API

**Methods:**
- **GET:** Lấy dữ liệu
- **POST:** Tạo mới / Gửi data
- **PUT:** Update toàn bộ
- **PATCH:** Update một phần
- **DELETE:** Xóa

**JSON Payload:**
```json
{
  "device_id": "ESP32_001",
  "temperature": 25.5,
  "humidity": 60,
  "timestamp": "2025-12-25T10:30:00Z"
}
```

**ESP32 HTTP Client:**
```cpp
HTTPClient http;
http.begin("http://api.server.com/data");
http.addHeader("Content-Type", "application/json");
int httpCode = http.POST("{\"temp\":25.5}");
```

#### WebSocket

**Tại sao WebSocket?**
- Real-time bidirectional communication
- Lower latency than HTTP polling
- Keep-alive connection

**Ứng dụng:**
- Live dashboard updates
- Chat applications
- Real-time notifications

#### CoAP (Constrained Application Protocol)

- Giống HTTP nhưng cho thiết bị low-power
- UDP-based
- Nhẹ hơn MQTT
- Dùng cho: Battery-powered sensors

#### LoRaWAN

**Đặc điểm:**
- Long range: 10-20km
- Low power: Pin chạy vài năm
- Low data rate: vài KB/s
- Star topology

**Ứng dụng:**
- Smart agriculture
- Smart city
- Environmental monitoring

---

### 2. Ngôn ngữ lập trình Backend/Frontend

#### JavaScript (Node.js) - KHUYẾN KHÍCH

**Tại sao JavaScript?**
- ✅ Full-stack: Frontend + Backend + Mobile
- ✅ **React Native:** Code một lần chạy iOS + Android
- ✅ **Node.js:** Backend mạnh mẽ, async I/O
- ✅ **React/Vue:** Frontend hiện đại
- ✅ Một ngôn ngữ cho tất cả

**Backend với Node.js + Express:**
```javascript
const express = require('express');
const app = express();

app.get('/api/temperature', (req, res) => {
    res.json({ temperature: 25.5, humidity: 60 });
});

app.listen(3000);
```

**MQTT Client trong Node.js:**
```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    client.subscribe('sensor/temperature');
});

client.on('message', (topic, message) => {
    console.log(topic, message.toString());
});
```

#### Python

**Backend:**
- **FastAPI:** Modern, fast, async
- **Flask:** Đơn giản, dễ học
- **Django:** Full-stack framework

**MQTT Client:**
```python
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("broker.hivemq.com", 1883)
client.publish("sensor/temp", "25.5")
```

#### PHP

- Hosting rẻ
- WordPress, Laravel
- Vẫn dùng nhiều

---

### 3. Linux - QUAN TRỌNG!

**Tại sao phải học Linux?**

✅ **Server chạy Linux:** 90% server IoT, Cloud đều là Linux  
✅ **Raspberry Pi chạy Linux:** Gateway, edge computing  
✅ **Docker chạy tốt trên Linux**  
✅ **Chi phí thấp:** Không mất tiền license  
✅ **Bảo mật tốt hơn, ổn định hơn**

**Commands cần biết:**
```bash
# File operations
cd /home/user
ls -la
mkdir project
rm -rf folder
cp file1.txt file2.txt
mv file1.txt /path/to/destination

# Permissions
chmod 755 script.sh
chown user:group file.txt

# Process management
ps aux | grep node
top
kill 1234
systemctl status mosquitto
systemctl start mosquitto

# Network
ifconfig
ping google.com
ssh user@192.168.1.100
scp file.txt user@server:/path/

# Text editor
nano file.txt
vim file.txt
```

**Cron jobs (Automation):**
```bash
# Edit crontab
crontab -e

# Chạy mỗi 5 phút
*/5 * * * * /path/to/script.sh

# Chạy lúc 2:30 AM mỗi ngày
30 2 * * * /path/to/backup.sh
```

---

### 4. Docker

**Tại sao cần Docker?**

✅ **Containerization:** Đóng gói app + dependencies  
✅ **Portable:** Chạy ở đâu cũng giống nhau  
✅ **Dễ deploy:** `docker-compose up -d` là xong  
✅ **Cô lập:** Mỗi service một container  
✅ **Scale dễ dàng:** Tăng container khi cần

**Docker Compose cho IoT:**
```yaml
version: '3'
services:
  mosquitto:
    image: eclipse-mosquitto
    ports:
      - "1883:1883"
  
  influxdb:
    image: influxdb:latest
    ports:
      - "8086:8086"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

**Commands:**
```bash
docker run -d -p 1883:1883 eclipse-mosquitto
docker ps
docker stop container_id
docker-compose up -d
docker-compose down
```

---

### 5. Cloud Platforms

#### ThingsBoard (Open Source) - KHUYẾN KHÍCH

**Tại sao ThingsBoard?**
- ✅ Miễn phí, self-hosted
- ✅ Dashboard builder trực quan
- ✅ Rule engine mạnh mẽ
- ✅ Device management
- ✅ REST API + MQTT

**Features:**
- Real-time dashboard
- Telemetry data
- Device attributes
- Alarms & notifications
- Rule chains

#### AWS IoT Core

**Professional-grade platform:**
- Device Shadow (Digital Twin)
- Rules Engine
- Lambda functions
- S3 storage
- DynamoDB

**Phức tạp nhưng scalable**

#### Firebase (Google)

**Dễ nhất cho beginner:**
- Realtime Database
- Firestore
- Cloud Functions
- Authentication
- Hosting

#### Azure IoT Hub (Microsoft)

- Enterprise focus
- Device Provisioning Service
- Azure Digital Twins
- IoT Edge

---

### 6. Database

#### Time-series Database

**InfluxDB - TỐT NHẤT CHO IoT**
- Optimize cho time-series data
- High write throughput
- Retention policies
- Continuous queries

**Query example:**
```sql
SELECT mean("temperature") 
FROM "sensors" 
WHERE time > now() - 24h 
GROUP BY time(1h)
```

**TimescaleDB:**
- PostgreSQL extension
- SQL familiar

#### NoSQL

**MongoDB:**
- Document-based
- Flexible schema
- JSON-like documents

**Firebase Realtime Database:**
- Real-time sync
- Offline support

#### SQL

**PostgreSQL:**
- Powerful, open source
- JSONB support

**MySQL:**
- Popular, dễ học

#### Cache

**Redis:**
- In-memory
- Cực nhanh
- Real-time data

---

## 🗓️ Lộ trình học chi tiết (6 tháng)

### Tháng 1: MQTT và Backend Foundation

#### Tuần 1-2: MQTT cơ bản
- Cài đặt Mosquitto broker trên PC/Raspberry Pi
- ESP32 publish data: temperature, humidity
- Python script subscribe và print data
- QoS levels: 0, 1, 2 - khi nào dùng?
- Retained messages và Last Will
- **Dự án:** Temperature monitoring với MQTT

#### Tuần 3-4: JavaScript/Node.js Backend
- Cài Node.js, npm
- Express.js: Tạo REST API đơn giản
- Routes: GET, POST, PUT, DELETE
- MQTT client trong Node.js
- Nhận data từ ESP32 qua MQTT, lưu vào array
- **Dự án:** Backend API nhận và trả về sensor data

### Tháng 2: Linux, Database và Docker

#### Tuần 5-6: Linux cơ bản
- Cài Ubuntu/Raspberry Pi OS
- Commands: `cd`, `ls`, `mkdir`, `rm`, `nano`
- `chmod`, `chown`: File permissions
- `systemctl`: Quản lý services
- `ssh`: Remote access
- Cron jobs: Tự động chạy script
- **Dự án:** Setup Mosquitto broker trên Raspberry Pi

#### Tuần 7-8: Database
- Cài đặt InfluxDB (time-series database)
- InfluxDB CLI: Create database, write, query
- ESP32 → MQTT → Node.js → InfluxDB
- Query data theo time range
- Cài MongoDB (NoSQL) - optional
- **Dự án:** Lưu sensor data vào InfluxDB

#### Tuần 9: Docker cơ bản
- Cài Docker và Docker Compose
- `docker run`, `docker ps`, `docker stop`
- `Dockerfile`: Build custom image
- `docker-compose.yml`: Multi-container
- Chạy Mosquitto + InfluxDB trong Docker
- **Dự án:** Docker stack cho IoT

### Tháng 3: Cloud Platform và Dashboard

#### Tuần 10-11: Cloud IoT Platform
- **Chọn 1 platform:**
  - ThingsBoard (khuyến khích): Self-hosted, miễn phí
  - AWS IoT Core: Professional
  - Firebase: Dễ nhất
- Tạo device, generate credentials
- ESP32 kết nối lên cloud
- Publish telemetry data
- Subscribe control commands
- **Dự án:** ESP32 + ThingsBoard

#### Tuần 12: Dashboard Building
- ThingsBoard dashboard: Widgets, gauges, charts
- Grafana + InfluxDB (alternative)
- Panels: Time series, gauge, stat
- Variables và filters
- Alert rules: Email, Telegram notification
- **Dự án:** Real-time monitoring dashboard

### Tháng 4: Frontend và Dự án tổng hợp

#### Tuần 13-14: Frontend Web (React hoặc Vue)
- HTML, CSS, JavaScript cơ bản
- React.js setup với Create React App
- Components, State, Props
- Fetch API: Gọi backend REST API
- WebSocket cho real-time update
- **Dự án:** Web dashboard tự code

#### Tuần 15-16: Dự án tổng hợp IoT

**Chọn 1 trong 3 hướng:**

**Option 1: Smart Home System**
- ESP32 + DHT22 + Relay + PIR
- MQTT broker (Mosquitto)
- Node.js backend + InfluxDB
- Dashboard (ThingsBoard hoặc React)
- **Tính năng:**
  - Hiển thị nhiệt độ, độ ẩm real-time
  - Điều khiển đèn, quạt từ dashboard
  - Alert khi phát hiện chuyển động
  - Historical data chart

**Option 2: Smart Agriculture**
- ESP32 + Soil moisture + Relay (pump)
- Tự động tưới khi đất khô
- Lịch sử độ ẩm đất
- Manual control từ dashboard
- Notification khi cần tưới

**Option 3: Environmental Monitoring**
- Multiple ESP32 nodes (3-5 locations)
- BME280: Temperature, humidity, pressure
- Tất cả gửi lên 1 broker
- Dashboard hiển thị multi-location
- So sánh data giữa các vị trí

---

## 🎯 Mục tiêu hoàn thành

Sau 6 tháng, bạn cần:
- ✅ Xây dựng hệ thống IoT hoàn chỉnh: Device → Cloud → Dashboard
- ✅ Sử dụng thành thạo MQTT và HTTP
- ✅ Deploy app lên Linux server với Docker
- ✅ Tạo dashboard real-time với Grafana hoặc web app
- ✅ Hoàn thành 1 dự án IoT full-stack

---

## 📚 Tài nguyên học tập

### Online Courses:
- 🎓 [MQTT Essentials - HiveMQ](https://www.hivemq.com/mqtt-essentials/)
- 🎓 [Node.js Tutorial - freeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/)
- 🎓 [Docker Tutorial - Docker](https://www.docker.com/101-tutorial/)

### YouTube Channels:
- 🎥 **Andreas Spiess** - IoT projects expert
- 🎥 **The Coding Train** - Web development
- 🎥 **TechWorld with Nana** - Docker, DevOps

### Documentation:
- 📘 [MQTT.org](https://mqtt.org)
- 📘 [ThingsBoard Docs](https://thingsboard.io/docs/)
- 📘 [InfluxDB Docs](https://docs.influxdata.com/)

---

**Bước trước:** [← Hệ thống nhúng](../../lo-trinh-detail.html?path=content/lo-trinh-aiot/embedded/index.md)

**Bước tiếp theo:** [Computer Vision (AI) →](../../lo-trinh-detail.html?path=content/lo-trinh-aiot/computer-vision/index.md)

**Quay lại:** [← Lộ trình tổng quát](../../lo-trinh-detail.html?path=content/lo-trinh-aiot/tong-quat.md)
