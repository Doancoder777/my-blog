# 🎯 Hướng dẫn Setup Comment System với Google Sheets

## Bước 1: Tạo Google Sheet

1. Vào https://sheets.google.com
2. Tạo sheet mới, đặt tên: **Blog Comments**
3. Đổi tên Sheet1 thành **comments**
4. Tạo các cột ở hàng đầu tiên:
   - Cột A: `pageId`
   - Cột B: `name`
   - Cột C: `email`
   - Cột D: `text`
   - Cột E: `parentId`
   - Cột F: `timestamp`

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, vào: **Extensions → Apps Script**
2. Xóa code mặc định
3. Dán code sau vào:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('comments');
  const pageId = e.parameter.pageId;
  
  if (e.parameter.action === 'get') {
    // Get comments for specific page
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const comments = rows
      .filter(row => row[0] === pageId)
      .map(row => ({
        pageId: row[0],
        name: row[1],
        email: row[2],
        text: row[3],
        parentId: row[4],
        timestamp: row[5]
      }));
    
    return ContentService.createTextOutput(JSON.stringify(comments))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('comments');
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'add') {
    // Add new comment or reply
    sheet.appendRow([
      data.pageId,
      data.name,
      data.email || '',
      data.text,
      data.parentId || '',
      data.timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: false}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Bước 3: Deploy Apps Script

1. Click nút **Deploy** (góc trên bên phải)
2. Chọn **New deployment**
3. Click biểu tượng **⚙️ Settings** → chọn **Web app**
4. Điền thông tin:
   - **Description**: Blog Comment System
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **CHO PHÉP QUYỀN TRUY CẬP** khi Google yêu cầu
7. **COPY URL** được tạo ra (dạng: `https://script.google.com/macros/s/...../exec`)

## Bước 4: Cập nhật Code

1. Mở file `script.js`
2. Tìm dòng:
```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
3. Thay bằng URL vừa copy:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```
4. Save file

## Bước 5: Test

1. Mở bất kỳ trang chi tiết bài viết nào
2. Nhập tên và nội dung bình luận
3. Click **Gửi bình luận**
4. Kiểm tra Google Sheet → sẽ thấy comment xuất hiện
5. Refresh trang → comment sẽ hiển thị

## 🎨 Tính năng

✅ Không cần đăng nhập
✅ Lưu trữ miễn phí vĩnh viễn
✅ Mỗi bài viết có comment riêng biệt
✅ **Trả lời comment (nested replies)**
✅ Hiển thị avatar tự động (chữ cái đầu tên)
✅ Sắp xếp comment mới nhất lên đầu
✅ Replies sắp xếp theo thứ tự thời gian
✅ Responsive và đẹp mắt
✅ Bảo mật XSS

## 🔧 Nếu gặp lỗi

**Lỗi: "Script URL not found"**
→ Chưa update SCRIPT_URL trong script.js

**Comments không hiển thị:**
→ Kiểm tra lại tên sheet phải là "comments" (chữ thường)

**Không gửi được comment:**
→ Kiểm tra quyền truy cập Apps Script là "Anyone"

## 📊 Quản lý Comments

- Vào Google Sheet để xem/xóa/edit comments
- Filter theo pageId để xem comments của từng bài
- Export ra CSV để backup

🎉 **XONG RỒI ĐÓ!**
