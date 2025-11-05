# 🌐 Website Tĩnh Fiin Credit

Website tĩnh giới thiệu về công ty Fiin Credit, được xây dựng bằng HTML, CSS và JavaScript thuần. Dự án có cấu trúc dễ mở rộng, giao diện hiện đại và responsive.

## ✨ Tính Năng

- ✅ **Navbar cố định** với hiệu ứng scroll và menu mobile responsive
- ✅ **Slider ảnh** tự động với animation mượt mà, hỗ trợ điều hướng bằng nút, indicator và swipe
- ✅ **Danh sách bài viết** được tải động từ file JSON
- ✅ **Animation effects** với Intersection Observer API
- ✅ **Thiết kế responsive** cho mọi thiết bị
- ✅ **Màu sắc thương hiệu** xanh Fiin chuyên nghiệp

## 📂 Cấu Trúc Thư Mục

```
webtinh/
├── index.html              # Trang chủ
├── about.html              # Trang giới thiệu
├── contact.html            # Trang liên hệ
├── README.md               # File hướng dẫn
├── guide.md                # File hướng dẫn chi tiết
│
├── assets/
│   ├── css/
│   │   ├── style.css       # CSS chính
│   │   ├── navbar.css      # CSS navbar
│   │   └── slider.css      # CSS slider
│   │
│   ├── js/
│   │   ├── main.js         # JavaScript chính
│   │   ├── slider.js       # Xử lý slider
│   │   └── articles.js     # Xử lý bài viết
│   │
│   └── images/
│       ├── slide1.jpg      # Ảnh slider 1
│       ├── slide2.jpg      # Ảnh slider 2
│       ├── slide3.jpg      # Ảnh slider 3
│       └── post*.jpg       # Ảnh bài viết
│
└── data/
    └── articles.json       # Dữ liệu bài viết
```

## 🚀 Hướng Dẫn Sử Dụng

### 1. Cài Đặt

1. Clone hoặc tải dự án về máy
2. Mở file `index.html` bằng trình duyệt web

### 2. Thêm Hình Ảnh

Thêm các hình ảnh vào thư mục `assets/images/`:

- **Slider images**: `slide1.jpg`, `slide2.jpg`, `slide3.jpg` (kích thước khuyến nghị: 1920x500px)
- **Article images**: `post1.jpg`, `post2.jpg`, ... (kích thước khuyến nghị: 600x400px)

Nếu không có ảnh, website sẽ hiển thị gradient màu xanh làm placeholder.

### 3. Chỉnh Sửa Nội Dung

#### Thêm/Sửa Bài Viết

Chỉnh sửa file `data/articles.json`:

```json
{
  "articles": [
    {
      "title": "Tiêu đề bài viết",
      "description": "Mô tả ngắn về bài viết",
      "image": "assets/images/post1.jpg",
      "link": "#"
    }
  ]
}
```

#### Thay Đổi Thông Tin Liên Hệ

Chỉnh sửa trong các file HTML:
- `about.html`: Thông tin công ty
- `contact.html`: Thông tin liên hệ
- Footer ở tất cả các trang

### 4. Tùy Chỉnh Màu Sắc

Chỉnh sửa biến CSS trong `assets/css/style.css`:

```css
:root {
    --primary-color: #0066cc;      /* Màu chính */
    --primary-dark: #0052a3;        /* Màu chính đậm */
    --secondary-color: #00a8e6;     /* Màu phụ */
    --accent-color: #00d4ff;        /* Màu nhấn */
}
```

## 🌐 Deploy Lên GitHub Pages

### Cách 1: Deploy Tự Động

1. Tạo repository mới trên GitHub (ví dụ: `fiin-credit-website`)
2. Upload toàn bộ dự án lên branch **main**
3. Vào **Settings** → **Pages**
4. Chọn **Source**: `Deploy from a branch`
5. Chọn **Branch**: `main` và folder `/ (root)`
6. Click **Save**
7. Sau vài phút, website sẽ có link: `https://[username].github.io/fiin-credit-website`

### Cách 2: Sử Dụng GitHub CLI

```bash
# Khởi tạo git
git init
git add .
git commit -m "Initial commit"

# Thêm remote
git remote add origin https://github.com/[username]/fiin-credit-website.git
git branch -M main
git push -u origin main
```

Sau đó làm theo **Cách 1** từ bước 3.

## 🔧 Mở Rộng Dự Án

### Thêm Trang Mới

1. Tạo file HTML mới (ví dụ: `services.html`)
2. Copy cấu trúc từ `about.html`
3. Thêm link vào navbar trong tất cả các file HTML:

```html
<li class="navbar-item">
    <a href="services.html" class="navbar-link">Dịch Vụ</a>
</li>
```

### Thêm Tính Năng JavaScript

1. Tạo file mới trong `assets/js/` (ví dụ: `services.js`)
2. Thêm script vào HTML:

```html
<script src="assets/js/services.js"></script>
```

### Thêm CSS Mới

1. Tạo file mới trong `assets/css/` (ví dụ: `services.css`)
2. Thêm link vào HTML:

```html
<link rel="stylesheet" href="assets/css/services.css">
```

## 📱 Responsive Design

Website được thiết kế responsive với các breakpoint:

- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

## 🎨 Animation & Effects

- **Fade-in**: Bài viết và các phần tử xuất hiện khi scroll
- **Slider**: Tự động chuyển slide mỗi 5 giây
- **Hover effects**: Hiệu ứng khi hover vào buttons và cards
- **Counter animation**: Số liệu thống kê tăng dần khi hiển thị

## 🌟 Tính Năng Nâng Cao

### Intersection Observer

Sử dụng Intersection Observer API để tối ưu performance khi animate các phần tử khi scroll.

### Touch/Swipe Support

Slider hỗ trợ swipe trên mobile để chuyển slide.

### Keyboard Navigation

Có thể điều hướng slider bằng phím mũi tên trái/phải.

## 📄 License

Dự án này được tạo cho mục đích giới thiệu và học tập.

## 📞 Liên Hệ

Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ qua trang Contact của website.

---

**Chúc bạn thành công với dự án! 🚀**

