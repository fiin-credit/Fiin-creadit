# 📝 Hướng Dẫn Trang Admin - Quản Lý Bài Viết

## 🎯 Tổng Quan

Trang `admin.html` là một công cụ quản lý nội dung đơn giản, cho phép bạn thêm, sửa, xóa bài viết mà không cần chỉnh sửa trực tiếp file JSON. Trang này được xây dựng bằng HTML, CSS và JavaScript thuần.

## 🔐 Bảo Mật Đăng Nhập

### Thông Tin Đăng Nhập Mặc Định
- **Username**: `admin`
- **Password**: `fiin2025`

### Cách Hoạt Động
1. **Session Storage**: Sử dụng `sessionStorage` để lưu trạng thái đăng nhập
   - Khi đăng nhập thành công, lưu `adminLoggedIn = 'true'`
   - Tự động kiểm tra khi trang được tải lại
   - Session hết hạn khi đóng trình duyệt

2. **Xác Thực**: 
   - So sánh username và password với `ADMIN_CREDENTIALS` trong code
   - Nếu đúng → hiển thị admin panel
   - Nếu sai → hiển thị thông báo lỗi

3. **Đổi Mật Khẩu**:
   ```javascript
   const ADMIN_CREDENTIALS = {
       username: 'admin',
       password: 'fiin2025'  // Thay đổi mật khẩu ở đây
   };
   ```

## 🏗️ Cấu Trúc Trang

### 1. Form Đăng Nhập
- Hiển thị khi chưa đăng nhập
- Form đơn giản với 2 trường: username và password
- Validation: cả 2 trường đều bắt buộc

### 2. Admin Panel (Sau khi đăng nhập)
- **Danh sách bài viết**: Hiển thị tất cả bài viết hiện có
- **Form thêm/sửa**: Form để thêm bài viết mới hoặc sửa bài viết cũ
- **Nút tải JSON**: Download file JSON đã cập nhật

## 📋 Các Chức Năng Chính

### 1. Thêm Bài Viết Mới
**Quy trình:**
1. Click nút "Thêm Bài Viết Mới"
2. Điền thông tin:
   - **Tiêu đề** (bắt buộc)
   - **Mô tả ngắn** (bắt buộc) - hiển thị trong card featured
   - **Nội dung đầy đủ** (bắt buộc) - hiển thị trong modal
   - **Đường dẫn ảnh** (tùy chọn)
   - **Link** (tùy chọn)
3. Click "Lưu"
4. Bài viết được thêm vào mảng `articles` trong JavaScript

### 2. Sửa Bài Viết
**Quy trình:**
1. Click nút "Sửa" bên cạnh bài viết cần sửa
2. Form tự động điền thông tin hiện có
3. Chỉnh sửa thông tin cần thay đổi
4. Click "Lưu"
5. Bài viết được cập nhật trong mảng

### 3. Xóa Bài Viết
**Quy trình:**
1. Click nút "Xóa" bên cạnh bài viết
2. Xác nhận xóa
3. Bài viết được xóa khỏi mảng

### 4. Tải File JSON
**Quy trình:**
1. Sau khi thêm/sửa/xóa bài viết
2. Click nút "Tải File JSON Đã Cập Nhật"
3. File `articles.json` được tải về
4. Thay thế file `data/articles.json` bằng file vừa tải

## 💻 Cách Hoạt Động Của Code

### 1. Load Dữ Liệu
```javascript
async function loadArticles() {
    const response = await fetch('data/articles.json');
    const data = await response.json();
    articles = data.articles || [];
    renderArticles();
}
```
- Fetch file JSON từ server
- Parse JSON thành mảng JavaScript
- Render danh sách bài viết

### 2. Render Danh Sách
```javascript
function renderArticles() {
    container.innerHTML = articles.map((article, index) => {
        return `
            <div class="article-item">
                <h3>${article.title}</h3>
                <button onclick="editArticle(${index})">Sửa</button>
                <button onclick="deleteArticle(${index})">Xóa</button>
            </div>
        `;
    }).join('');
}
```
- Duyệt qua mảng `articles`
- Tạo HTML cho mỗi bài viết
- Gán event handler cho nút sửa/xóa

### 3. Lưu Bài Viết
```javascript
function saveArticle(event) {
    const index = parseInt(document.getElementById('articleIndex').value);
    const article = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        content: document.getElementById('content').value,
        image: document.getElementById('image').value,
        link: document.getElementById('link').value
    };
    
    if (index === -1) {
        articles.push(article);  // Thêm mới
    } else {
        articles[index] = article;  // Cập nhật
    }
    
    renderArticles();  // Cập nhật danh sách
}
```

### 4. Download JSON
```javascript
function downloadJSON() {
    const data = { articles: articles };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'articles.json';
    a.click();
}
```
- Chuyển mảng JavaScript thành JSON string
- Tạo Blob object
- Tạo link tải và tự động click

## 🎨 UI/UX Features

### Responsive Design
- Form đăng nhập: max-width 400px
- Admin panel: max-width 1200px
- Tự động điều chỉnh trên mobile

### User Feedback
- Alert messages khi thêm/sửa/xóa thành công
- Alert lỗi khi đăng nhập sai
- Confirmation dialog khi xóa bài viết

### Form Validation
- Required fields: Tiêu đề, Mô tả, Nội dung
- HTML5 validation với `required` attribute

## 📝 Cấu Trúc Dữ Liệu JSON

Mỗi bài viết có cấu trúc:
```json
{
  "title": "Tiêu đề bài viết",
  "description": "Mô tả ngắn - hiển thị trong card featured",
  "content": "Nội dung đầy đủ - hiển thị trong modal khi click",
  "image": "assets/images/post1.jpg",
  "link": "#"
}
```

## ⚠️ Lưu Ý Quan Trọng

### 1. CORS Policy
- **Vấn đề**: Trang admin cần fetch file JSON từ server
- **Giải pháp**: Chạy local server thay vì mở file trực tiếp
  ```bash
  # Python
  python -m http.server 8000
  
  # Node.js
  npx http-server
  ```
- Truy cập: `http://localhost:8000/admin.html`

### 2. Bảo Mật
- Mật khẩu được lưu trong code JavaScript (không an toàn)
- Chỉ phù hợp cho môi trường development/local
- **Production**: Nên dùng backend authentication

### 3. Session Storage
- Dữ liệu chỉ tồn tại trong tab hiện tại
- Đóng trình duyệt → tự động đăng xuất
- Refresh trang → vẫn giữ đăng nhập

## 🚀 Quy Trình Sử Dụng Hoàn Chỉnh

1. **Chạy Local Server**
   ```bash
   python -m http.server 8000
   ```

2. **Truy cập Admin**
   - Mở: `http://localhost:8000/admin.html`
   - Đăng nhập với: `admin` / `fiin2025`

3. **Quản Lý Bài Viết**
   - Thêm bài viết mới
   - Sửa bài viết cũ
   - Xóa bài viết không cần thiết

4. **Cập Nhật Website**
   - Click "Tải File JSON Đã Cập Nhật"
   - Thay thế file `data/articles.json`
   - Refresh trang chủ để xem thay đổi

## 🔧 Tùy Chỉnh

### Đổi Mật Khẩu
Chỉnh sửa trong `admin.html`:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'your_username',
    password: 'your_password'
};
```

### Thay Đổi Màu Sắc
Sử dụng CSS variables trong `style.css`:
```css
:root {
    --primary-color: #7D80E8;
    --secondary-color: #8B8FD9;
}
```

## 📚 Tài Liệu Tham Khảo

- **Fetch API**: Đọc file JSON từ server
- **SessionStorage**: Lưu trạng thái đăng nhập
- **Blob API**: Tạo file download
- **JSON.stringify**: Chuyển object thành JSON string

---

**Tác giả**: Fiin Credit Website Team  
**Phiên bản**: 1.0  
**Ngày cập nhật**: 2025

