# 🚀 Dự án của tôi

Dưới đây là các dự án AIoT và Embedded Systems mà mình đã thực hiện.

---

## 1️⃣ Ngôi nhà thông minh điều khiển bằng App Flutter

📅 **Thời gian:** 20/10/2025 - 03/11/2025

### 📝 Mô tả

Hệ sinh thái ngôi nhà thông minh giúp người dùng có thể dễ dàng thêm thiết bị vào app qua ID thiết bị, tích hợp trợ lý **Gemini AI** để điều khiển ngôi nhà bằng giọng nói.

### 🛠 Công nghệ sử dụng

**Phần cứng:**
- ESP32
- Các cảm biến môi trường (nhiệt độ, độ ẩm, ánh sáng, khí gas, bụi mịn, mưa, độ ẩm đất, pir)
- Relay điều khiển thiết bị
- Động cơ điều tốc
- Motor DC
- Servo Motor

**Phần mềm:**
- Flutter (Mobile App)
- Arduino IDE (Lập trình ESP32)
- MQTT Protocol
- Gemini AI API

### ✨ Tính năng chính

- 📱 **Quản lý thiết bị:** Thêm, xóa, chỉnh sửa thiết bị thông qua ID
- 🎮 **Điều khiển thiết bị:** Bật/tắt, điều chỉnh cường độ thiết bị từ xa
- 🌡️ **Theo dõi môi trường:** Xem thời gian thực nhiệt độ, độ ẩm, ánh sáng, chất lượng không khí
- 🤖 **Quy tắc tự động:** Người dùng tự thiết lập quy tắc điều khiển (không cần code)
  - VD: Nồng độ khí gas cao → Bật quạt thông hơi
  - VD: Trời tối → Tự động bật đèn
  - VD: Nhiệt độ cao → Bật thiết bị phun sương
- 🎙️ **Điều khiển bằng giọng nói:** Tích hợp Gemini AI
  - VD: "Tôi đi vào phòng mà thấy u ám quá" → AI tự động bật đèn phòng

### 🏆 Kết quả đạt được

- ✅ **Tính mở rộng cao:** Người dùng có thể dễ dàng thêm thiết bị mới
- ✅ **Tốc độ điều khiển nhanh:** Sử dụng giao thức MQTT cho độ trễ thấp
- ✅ **Giao diện thân thiện:** App Flutter mượt mà, dễ sử dụng
- ✅ **AI thông minh:** Hiểu ngữ cảnh và điều khiển thiết bị phù hợp

### 🔗 Demo & Source Code

- 🐙 **GitHub:** [flutter-iot-smart-home](https://github.com/Doancoder777/flutter-iot-smart-home.git)

**Languages:** Flutter (Dart), C++ (Arduino)

---

## 2️⃣ Thùng rác thông minh tích hợp AI xử lý ảnh và giọng nói

📅 **Thời gian:** 01/12/2025 - 25/12/2025

### 📝 Mô tả

Hệ thống thùng rác thông minh có khả năng phân loại rác tự động thành 3 loại: **rác sinh học**, **rác vô cơ không đốt được**, và **rác vô cơ đốt được**. Người dùng có thể điều khiển bằng giọng nói thông qua trợ lý AI **DeepSeek** hoặc đưa rác vào camera để AI tự động nhận diện và mở thùng tương ứng.

### 🛠 Công nghệ sử dụng

**Phần cứng:**
- ESP32
- Servo Motor (điều khiển nắp thùng)
- Camera module (ESP32-CAM)
- Microphone (nhận giọng nói)

**Phần mềm:**
- Python (AI Model Training & Inference)
- Vision Transformer (Object Detection)
- DeepSeek AI API (Voice Assistant)
- Arduino IDE (Lập trình ESP32)
- Google Colab (Training Model)
- VS Code

### ✨ Tính năng chính

- 🗣️ **Điều khiển bằng giọng nói:** Người dùng nói tên loại rác, AI DeepSeek phân tích và gửi lệnh mở thùng tương ứng
- 📸 **Nhận diện qua Camera:** Đưa rác vào trước camera, AI tự động phân loại và mở nắp thùng phù hợp
- 🤖 **Phân loại tự động 3 loại rác:**
  - Rác sinh học (organic waste)
  - Rác vô cơ không đốt được (non-combustible inorganic)
  - Rác vô cơ đốt được (combustible inorganic)
- ⚡ **Mở nắp tự động:** Servo motor mở nắp thùng tương ứng sau khi phân loại
- 📊 **Theo dõi thống kê:** Ghi nhận số lượng rác từng loại đã phân loại

### 🏆 Kết quả đạt được

- ✅ **Độ chính xác cao:** Phân loại rác đạt độ chính xác trên **90%**
- ✅ **Phản hồi nhanh:** Thời gian nhận diện và mở nắp < 2 giây
- ✅ **Đa phương thức:** Hỗ trợ cả giọng nói và hình ảnh
- ✅ **Thân thiện môi trường:** Giúp người dùng phân loại rác đúng cách, góp phần bảo vệ môi trường

### 🔗 Demo & Source Code

- 🐙 **GitHub:** [smart-trash-AIOT](https://github.com/Doancoder777/smart-trash-AIOT.git)

**Languages:** Python, C++ (Arduino)

---

## 3️⃣ Cánh tay Robot vệ sinh trụ điện

📅 **Thời gian:** 23/12/2024 - 23/06/2025

### 📝 Mô tả

Hệ thống cánh tay robot tự động nhận diện các máy biến áp bị bẩn trên trụ điện và thực hiện vệ sinh bằng vòi nước được gắn trên đầu cánh tay. Robot sử dụng AI để phát hiện vị trí cần làm sạch và điều khiển cánh tay di chuyển chính xác đến vị trí đó.

### 🛠 Công nghệ sử dụng

**Phần cứng:**
- ESP32 (Điều khiển cánh tay robot)
- Raspberry Pi (Xử lý AI)
- Servo Motors (Điều khiển các khớp cánh tay)
- Camera module (Nhận diện vị trí bẩn)
- Máy bơm nước & vòi phun

**Phần mềm:**
- Python (AI Model & Computer Vision)
- Roboflow (Dataset Management & Training)
- Google Colab (Training Model)
- Arduino IDE (Lập trình ESP32)
- OpenCV (Image Processing)

### ✨ Tính năng chính

- 🤖 **Nhận diện tự động:** AI phát hiện vị trí máy biến áp bị bẩn trên trụ điện
- 🦾 **Điều khiển cánh tay mô phỏng:** Người vận hành có thể điều khiển thủ công qua cánh tay mô phỏng
- 🧠 **Điều khiển bằng AI:** Raspberry Pi xử lý hình ảnh và điều khiển cánh tay tự động
- 💦 **Vệ sinh tự động:** Cánh tay di chuyển đến đúng vị trí và kích hoạt vòi nước
- 📸 **Theo dõi thời gian thực:** Camera giám sát quá trình vệ sinh

### 🏆 Kết quả đạt được

- ✅ **Hoàn thành prototype:** Robot hoạt động ổn định với độ chính xác 85%
- ✅ **Tiết kiệm thời gian:** Giảm 40% thời gian vệ sinh so với phương pháp thủ công
- ✅ **An toàn:** Giảm thiểu rủi ro cho công nhân làm việc trên cao

### 🔗 Demo & Source Code

- 🎥 **Demo Video:** [Google Drive](https://drive.google.com/file/d/1tlEbvD2oJkUqdiHpG4gwxcWOJgUCfpmM/view?usp=sharing)
- 🔒 **Source Code:** Không công khai (Chính sách bảo mật của công ty)

**Languages:** Python, C++ (Arduino)

---

## 4️⃣ Xe RC điều khiển bằng App Flutter

📅 **Thời gian:** 20/09/2023 - 02/10/2023

### 📝 Mô tả

Dự án xe RC (Remote Control) điều khiển không dây thông qua ứng dụng Flutter trên smartphone. Người dùng có thể điều khiển xe di chuyển theo nhiều hướng khác nhau với giao diện trực quan và dễ sử dụng.

### 🛠 Công nghệ sử dụng

**Phần cứng:**
- STM32F401 (Vi điều khiển chính)
- ESP-01S ESP8266 (Wi-Fi Module)
- L298N (Motor Driver)
- DC Motors (4 bánh xe)
- Pin Li-ion 7.4V

**Phần mềm:**
- STM32 Cube IDE (Lập trình STM32)
- Arduino IDE (Lập trình ESP8266)
- Flutter (Mobile App)
- VS Code

### ✨ Tính năng chính

- 📱 **Điều khiển qua App:** Giao diện điều khiển trực quan trên Flutter app
- 🎮 **Điều khiển đa hướng:** Tiến, lùi, rẽ trái, rẽ phải, quay tại chỗ
- 📡 **Kết nối Wi-Fi:** Điều khiển không dây thông qua ESP8266
- ⚡ **Phản hồi thời gian thực:** Xe phản ứng nhanh với lệnh từ app
- 🔋 **Hiển thị trạng thái:** Theo dõi trạng thái kết nối trên app

### 🏆 Kết quả đạt được

- ✅ **Điều khiển mượt mà:** Xe di chuyển chính xác theo lệnh
- ✅ **Kết nối ổn định:** Kết nối Wi-Fi ổn định trong phạm vi 20-30m
- ✅ **Giao diện thân thiện:** App Flutter đơn giản, dễ sử dụng
- ✅ **Tốc độ phản hồi tốt:** Độ trễ điều khiển thấp

### 🔗 Demo & Source Code

- 🎥 **Demo Video:** [Google Drive](https://drive.google.com/file/d/1EDkQOZntBaWB2o-oiluQtUkMzNpEesak/view?usp=sharing)

**Languages:** C (STM32), C++ (Arduino), Flutter (Dart)

---
