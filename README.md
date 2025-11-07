# OWASP DSOMM Assessment Tool

Ứng dụng web tĩnh giúp tự đánh giá mức trưởng thành theo OWASP DevSecOps Maturity Model (DSOMM) và mapping với OWASP SAMM 2.0.

## 🌐 Demo trực tuyến

Website đã được public trên GitHub Pages: [Xem demo](https://your-username.github.io/dsomm-preview/)

## 🚀 Cách chạy local

### Cách 1: Mở trực tiếp (không khuyến nghị)
- Mở trực tiếp `index.html` bằng trình duyệt hiện đại (Chrome/Safari/Edge)
- ⚠️ Có thể gặp lỗi CORS khi load dữ liệu JSON

### Cách 2: Chạy server tĩnh (khuyến nghị)

**Với Python 3:**
```bash
cd "DSOMM Preview"
python3 -m http.server 8080
# Mở http://localhost:8080
```

**Với Node.js (http-server):**
```bash
npx http-server -p 8080
# Mở http://localhost:8080
```

**Với PHP:**
```bash
php -S localhost:8080
# Mở http://localhost:8080
```

## 📦 Deploy lên GitHub Pages

### Bước 1: Tạo repository trên GitHub
1. Tạo repository mới trên GitHub (ví dụ: `dsomm-preview`)
2. Clone repository về máy:
```bash
git clone https://github.com/your-username/dsomm-preview.git
cd dsomm-preview
```

### Bước 2: Copy files vào repository
Copy các file sau vào repository:
- `index.html`
- `app.js`
- `style.css`
- `data/` folder (chứa `dsomm-devsecops.json`)
- `.nojekyll` (file này đã được tạo sẵn)
- `README.md`

### Bước 3: Commit và push
```bash
git add .
git commit -m "Initial commit: DSOMM Assessment Tool"
git push -u origin main
```

### Bước 4: Enable GitHub Pages
1. Vào Settings → Pages trong repository
2. Chọn branch `main` và folder `/ (root)`
3. Click Save
4. Đợi vài phút, website sẽ có tại: `https://your-username.github.io/dsomm-preview/`

### Bước 5: Cập nhật URL trong README
Thay `your-username` và `dsomm-preview` bằng tên thực tế của bạn trong file README.md này.

## ✨ Tính năng

- ✅ **Đánh giá DSOMM**: Tick các tiêu chí đã đáp ứng, tự động tính mức trưởng thành (1-5)
- ✅ **Tổng quan trực quan**: Biểu đồ radar hiển thị mức trưởng thành theo từng domain
- ✅ **Mapping SAMM**: Tự động mapping kết quả DSOMM sang OWASP SAMM 2.0
- ✅ **Biểu đồ SAMM**: Radar chart hiển thị mức SAMM theo function và stream
- ✅ **Đa ngôn ngữ**: Hỗ trợ Tiếng Việt và English
- ✅ **Lưu trữ**: Import/Export đánh giá dưới dạng JSON
- ✅ **Tooltip chi tiết**: Hover vào tiêu chí để xem description, risk, measure, implementation guide, references

## 📖 Sử dụng

1. **Đánh giá tiêu chí**: 
   - Tick các tiêu chí (activities) mà bạn đã đáp ứng
   - Mức trưởng thành sẽ tự động tính toán dựa trên tỷ lệ tiêu chí đã tick

2. **Xem tổng quan**:
   - Tab "DSOMM" hiển thị tổng quan và ma trận tiêu chí
   - Tab "SAMM Mapping" hiển thị kết quả mapping với SAMM 2.0

3. **Lưu trữ**:
   - Click "Xuất đánh giá" để tải file JSON
   - Click "Nhập đánh giá" để load lại từ file JSON

4. **Chuyển đổi ngôn ngữ**:
   - Click vào button ngôn ngữ (🌐) ở header
   - Chọn Tiếng Việt hoặc English

## 🛠️ Cấu trúc dự án

```
.
├── index.html          # File HTML chính
├── app.js             # Logic JavaScript
├── style.css          # Stylesheet
├── data/
│   └── dsomm-devsecops.json  # Dữ liệu DSOMM
├── scripts/
│   └── build-dsomm-json.mjs  # Script build JSON từ YAML
├── .gitignore         # Git ignore rules
├── .nojekyll          # Disable Jekyll processing
└── README.md          # File này
```

## 📝 Tuỳ biến dữ liệu DSOMM

Dữ liệu DSOMM nằm trong `data/dsomm-devsecops.json`. Bạn có thể:
- Chỉnh sửa trực tiếp file JSON
- Hoặc chạy script `scripts/build-dsomm-json.mjs` để build từ YAML source

## 🔧 Development

### Build JSON từ YAML source
```bash
node scripts/build-dsomm-json.mjs
```

Script này sẽ đọc YAML từ `DevSecOps-MaturityModel-data` và tạo ra `data/dsomm-devsecops.json`.

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🙏 Credits

- **OWASP DSOMM**: [DevSecOps Maturity Model](https://owasp.org/www-project-devsecops-maturity-model/)
- **OWASP SAMM**: [Software Assurance Maturity Model](https://owasp.org/www-project-samm/)

## 📧 Liên hệ

Nếu có vấn đề hoặc đề xuất, vui lòng tạo issue trên GitHub repository.
