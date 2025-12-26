# 🤖 YOLOv10 và bài toán phân loại rác thải nhựa

## Giới thiệu

![YOLOv10 Detection](../../../assets/images/download%20(2).jpg)
*YOLOv10 phát hiện và phân loại rác thải realtime*

{{youtube:WgPbbWmnXJ8|YOLOv10 Tutorial}}

*🎥 Video: "Train YOLOv10 Custom Dataset" - Hướng dẫn train YOLOv10*

**YOLOv10** là phiên bản mới nhất (2024) của dòng YOLO (You Only Look Once), được tối ưu hóa để đạt được sự cân bằng giữa **tốc độ** và **độ chính xác** - điều hoàn hảo cho các hệ thống nhúng như Raspberry Pi.

Trong dự án **Smart Trash Can**, mình sử dụng YOLOv10 để phân loại rác thải thành 3 nhóm:
- 🟢 **Organic** (Hữu cơ): Thức ăn thừa, lá cây
- 🔵 **Recyclable** (Tái chế): Chai nhựa, lon nhôm, giấy
- 🔴 **Hazardous** (Nguy hại): Pin, thuốc trừ sâu

---

## Tại sao chọn YOLOv10?

### So sánh với các phiên bản cũ:

| Model | FPS (RPi 4) | mAP@50 | Kích thước | Năm |
|-------|-------------|---------|------------|-----|
| YOLOv5s | 12 | 65.3% | 14MB | 2020 |
| YOLOv8n | 18 | 67.8% | 6MB | 2023 |
| **YOLOv10n** | **22** | **68.4%** | **5.8MB** | 2024 |

### Ưu điểm của YOLOv10:
1. ✅ **Nhanh hơn 25%** so với YOLOv8 nhờ kiến trúc NMS-free (bỏ Non-Maximum Suppression)
2. ✅ **Nhẹ hơn**: Model nano chỉ 5.8MB, chạy được trên ESP32-S3
3. ✅ **Chính xác hơn**: Cải thiện mAP nhờ Dual Head và Spatial-channel decoupled downsampling

---

## Chuẩn bị Dataset

### 1. Thu thập ảnh
Mình chụp **1,200 ảnh** rác thải tại Việt Nam (vì dataset quốc tế không phù hợp với ngữ cảnh VN):
- 400 ảnh hữu cơ (vỏ trái cây, cơm thừa...)
- 600 ảnh tái chế (chai nước, hộp carton...)
- 200 ảnh nguy hại (pin, bình thuốc trừ sâu...)

### 2. Gán nhãn (Labeling)
Dùng công cụ **LabelImg** hoặc **Roboflow** để vẽ bounding box.

```yaml
# data.yaml
train: ../train/images
val: ../valid/images

nc: 3  # Số lượng class
names: ['organic', 'recyclable', 'hazardous']
```

### 3. Data Augmentation
Tăng cường dữ liệu để tránh overfitting:

```python
# augmentation trong Ultralytics
from ultralytics import YOLO

model = YOLO('yolov10n.pt')
model.train(
    data='data.yaml',
    epochs=100,
    imgsz=640,
    augment=True,
    hsv_h=0.015,  # Hue
    hsv_s=0.7,    # Saturation
    hsv_v=0.4,    # Value
    degrees=10,   # Xoay ảnh
    flipud=0.5,   # Lật dọc
    fliplr=0.5,   # Lật ngang
)
```

---

## Training trên Google Colab

### Bước 1: Setup môi trường

```python
!pip install ultralytics

from ultralytics import YOLO
import torch

# Kiểm tra GPU
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"Device: {torch.cuda.get_device_name(0)}")
```

### Bước 2: Tải pretrained model

```python
# Download YOLOv10 nano
model = YOLO('yolov10n.pt')
```

### Bước 3: Training

```python
# Train 100 epochs
results = model.train(
    data='trash_data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device=0,  # GPU 0
    patience=20,
    project='trash_classifier',
    name='yolov10n_v1'
)
```

### Bước 4: Đánh giá model

```python
# Validate
metrics = model.val()
print(f"mAP@50: {metrics.box.map50}")
print(f"mAP@50-95: {metrics.box.map}")

# Precision-Recall per class
for i, name in enumerate(['organic', 'recyclable', 'hazardous']):
    print(f"{name}: P={metrics.box.p[i]:.3f}, R={metrics.box.r[i]:.3f}")
```

### Kết quả của mình:

```
Epoch 100/100:
  mAP@50: 0.874
  mAP@50-95: 0.623
  
Class Performance:
  organic:    Precision=0.89, Recall=0.85
  recyclable: Precision=0.91, Recall=0.88
  hazardous:  Precision=0.82, Recall=0.79
```

---

## Deploy trên Raspberry Pi 4

### 1. Chuyển đổi sang ONNX (tăng tốc độ)

```python
from ultralytics import YOLO

model = YOLO('best.pt')
model.export(format='onnx', opset=12)
```

### 2. Code inference

```python
import cv2
from ultralytics import YOLO

model = YOLO('best.onnx')

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    results = model(frame, conf=0.5)
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            label = f"{model.names[cls]} {conf:.2f}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
    
    cv2.imshow('Trash Classifier', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### 3. Tối ưu hóa hiệu năng

**Trên Raspberry Pi 4 (4GB RAM):**

```python
# Giảm kích thước input
results = model(frame, imgsz=320, conf=0.6)  # Từ 640 → 320

# Giảm FPS camera
cap.set(cv2.CAP_PROP_FPS, 15)  # Từ 30 → 15 FPS

# Sử dụng threading
import threading

def process_frame(frame):
    return model(frame, imgsz=320)

thread = threading.Thread(target=process_frame, args=(frame,))
```

**Kết quả:**
- FPS tăng từ 12 → 22
- Độ trễ giảm từ 83ms → 45ms

---

## So sánh YOLOv10 vs các phương pháp khác

### YOLOv8 vs YOLOv10 (trên cùng dataset)

```
YOLOv8n:
  mAP@50: 0.862
  FPS (RPi4): 18
  Inference time: 55ms

YOLOv10n:
  mAP@50: 0.874  (+1.2%)
  FPS (RPi4): 22  (+22%)
  Inference time: 45ms  (-18%)
```

### ResNet50 (Classification) vs YOLOv10 (Detection)

```
ResNet50:
  Accuracy: 89%
  ❌ Không xác định vị trí vật thể
  ❌ Chỉ xử lý được 1 vật trong ảnh
  
YOLOv10:
  mAP@50: 87.4%
  ✅ Xác định vị trí chính xác
  ✅ Phát hiện nhiều vật cùng lúc
```

---

## Những thử thách và cách giải quyết

### ❌ Vấn đề 1: False positive khi ánh sáng yếu
**Giải pháp:** Thêm 200 ảnh chụp trong điều kiện ánh sáng kém vào training set.

### ❌ Vấn đề 2: Chai nhựa trong suốt bị miss detection
**Giải pháp:** 
- Tăng brightness/contrast trong preprocessing
- Thêm data augmentation với `hsv_v=0.6`

### ❌ Vấn đề 3: Model size quá lớn cho ESP32-S3
**Giải pháp:** Chuyển sang YOLOv10-nano với quantization INT8:

```python
# Quantize model
from ultralytics import YOLO

model = YOLO('best.pt')
model.export(format='tflite', int8=True)
# Kích thước giảm từ 5.8MB → 1.9MB
```

---

## Kết luận

YOLOv10 là lựa chọn tuyệt vời cho các dự án AIoT nhờ:
1. **Tốc độ nhanh** - Chạy realtime trên Raspberry Pi
2. **Nhẹ** - Deploy được trên edge device
3. **Chính xác** - mAP cao hơn các phiên bản cũ

Trong dự án Smart Trash Can, YOLOv10 giúp hệ thống **tự động phân loại rác với độ chính xác 87.4%**, góp phần vào việc bảo vệ môi trường! 🌍

---

## Tài liệu tham khảo

- [YOLOv10 Paper](https://arxiv.org/abs/2405.14458)
- [Ultralytics YOLOv10 Documentation](https://docs.ultralytics.com)
- [Trash Classification Dataset](https://universe.roboflow.com/waste-classification)

---

**Tags:** `YOLOv10` `Computer Vision` `Object Detection` `Raspberry Pi` `Trash Classification` `AIoT`
