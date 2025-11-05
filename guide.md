# 🌐 Hướng Dẫn Tạo Website Tĩnh Về Fiin Credit

Website tĩnh giới thiệu Fiin Credit, gồm thanh điều hướng, slider ảnh có animation, và danh sách bài viết được tải từ file JSON.  
Dự án được xây dựng hoàn toàn bằng **HTML, CSS, JavaScript**, dễ dàng mở rộng và deploy lên **GitHub Pages**.

---

## 📂 1. Cấu Trúc Thư Mục Dự Án

Tạo các thư mục chính sau để dự án dễ mở rộng và quản lý:

- **index.html**, about.html, contact.html  
  → Các trang nội dung chính.  

- **assets/**
  - **css/** → Chứa file giao diện như `style.css`, `navbar.css`, `slider.css`  
  - **js/** → Chứa file xử lý logic như `main.js`, `slider.js`, `articles.js`  
  - **images/** → Chứa ảnh logo, slider, ảnh bài viết, v.v.  

- **data/**
  - **articles.json** → Lưu danh sách bài viết dưới dạng JSON  

- **README.md** → File hướng dẫn (chính là file này)

---

## 🧭 2. Nội Dung Trang Chính

Trang chủ sẽ gồm:
- Thanh **navbar** cố định trên cùng để di chuyển giữa các trang.  
- Phần **slider ảnh** có hiệu ứng chuyển động mượt.  
- Khu vực **hiển thị danh sách bài viết**, lấy dữ liệu từ file JSON.  

Các trang phụ (`about.html`, `contact.html`) có thể tái sử dụng cùng một thanh navbar và footer để giữ bố cục thống nhất.

---

## 🧩 3. Hoạt Động Của Website

1. Khi trang được tải, JavaScript sẽ:
   - Hiển thị **slider** với hiệu ứng tự động chạy.  
   - Gọi file **JSON** để lấy danh sách bài viết.  
   - Render các bài viết dưới dạng **thẻ (card)** có ảnh, tiêu đề và mô tả.  

2. CSS sẽ xử lý toàn bộ:
   - Màu sắc thương hiệu (xanh Fiin).  
   - Hiệu ứng hover, bóng đổ, bo tròn, và animation.  
   - Responsive cho điện thoại và máy tính.

---

## 🎞️ 4. Hiệu Ứng Animation

- **Slider** sử dụng animation chuyển ảnh tự động.  
- **Bài viết** xuất hiện với hiệu ứng **fade-in** hoặc **slide-up** khi cuộn trang.  
- **Navbar** cố định trên đầu và có hiệu ứng sáng khi hover.  

Tất cả hiệu ứng đều nên thực hiện bằng **CSS animation** hoặc **Intersection Observer API** trong JavaScript.

---

## 🧮 5. File JSON Bài Viết

Tạo file JSON để lưu thông tin các bài viết, ví dụ:
- Tiêu đề bài viết  
- Đường dẫn ảnh minh họa  
- Nội dung mô tả ngắn  

JavaScript sẽ đọc file này và tự động hiển thị danh sách bài viết mà không cần viết lại HTML thủ công.

---

## 🖼️ 6. Hình Ảnh

Tạo thư mục **assets/images/** để lưu:
- Logo của website  
- Ảnh dùng cho slider  
- Ảnh minh họa cho từng bài viết  

Nên đặt tên ảnh rõ ràng theo chức năng (ví dụ `slide1.jpg`, `post1.jpg`, `logo.png`).

---

## ⚙️ 7. Quy Tắc Mở Rộng Dự Án

- Mỗi phần (HTML, CSS, JS) nằm trong folder riêng để dễ bảo trì.  
- Khi cần thêm tính năng:
  - Tạo thêm file `.js` trong `assets/js/`.  
  - Thêm file `.css` tương ứng trong `assets/css/`.  
  - Chỉ cần import file đó trong HTML.  
- Có thể thêm các trang mới (ví dụ `services.html`, `faq.html`) và dùng cùng navbar.

---

## 🚀 8. Deploy Lên GitHub Pages

1. Tạo repository mới trên GitHub (ví dụ `fiin-credit-website`).  
2. Upload toàn bộ dự án lên branch **main**.  
3. Truy cập:
   - **Settings → Pages → Branch → main → /(root)**  
   - Bấm **Save**  
4. Sau vài phút, website sẽ có link:
