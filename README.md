# OWASP DSOMM Assessment Tool

[🇻🇳 Tiếng Việt](#tiếng-việt) | [🇬🇧 English](#english)

---

## 🇻🇳 Tiếng Việt

### Giới thiệu

Một ứng dụng web tĩnh cho phép tự đánh giá mức độ trưởng thành DevSecOps dựa trên OWASP DevSecOps Maturity Model (DSOMM), đồng thời liên kết tương ứng với OWASP SAMM 2.0. Thay vì ngồi tranh luận "chúng ta đang làm DevSecOps đến đâu", công cụ này đưa ra thang đo cụ thể, tiêu chí rõ ràng, và kết quả nhất quán — không còn kiểu "ý kiến cá nhân lãnh đạo" hay "cảm tính đội security".

Nó phù hợp cho các tổ chức muốn nhìn thẳng vào thực tế: đang ở cấp độ nào, thiếu gì, và cần đầu tư vào đâu để đi tiếp. Đừng mong nó sẽ đẹp đẽ hơn sự thật. Nhưng ít nhất, sau khi dùng, bạn sẽ biết mình đang đứng ở đâu và không còn nói mơ hồ về "chúng ta cũng DevSecOps rồi".

### 🌐 Demo trực tuyến

Website đã được public trên GitHub Pages: [Xem demo](https://shino-337.github.io/)

### 🚀 Cách chạy local

#### Cách 1: Mở trực tiếp (không khuyến nghị)
- Mở trực tiếp `index.html` bằng trình duyệt hiện đại (Chrome/Safari/Edge)
- ⚠️ Có thể gặp lỗi CORS khi load dữ liệu JSON

#### Cách 2: Chạy server tĩnh (khuyến nghị)

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

### ✨ Tính năng

- ✅ **Đánh giá DSOMM**: Tick các tiêu chí đã đáp ứng, tự động tính mức trưởng thành (1-5)
- ✅ **Tổng quan trực quan**: Biểu đồ radar hiển thị mức trưởng thành theo từng domain
- ✅ **Mapping SAMM**: Tự động mapping kết quả DSOMM sang OWASP SAMM 2.0
- ✅ **Biểu đồ SAMM**: Radar chart hiển thị mức SAMM theo function và stream
- ✅ **Đa ngôn ngữ**: Hỗ trợ Tiếng Việt và English
- ✅ **Lưu trữ**: Import/Export đánh giá dưới dạng JSON
- ✅ **Tooltip chi tiết**: Hover vào tiêu chí để xem description, risk, measure, implementation guide, references

### 📖 Sử dụng

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

### 🛠️ Cấu trúc dự án

```
.
├── index.html          # File HTML chính
├── app.js              # Logic JavaScript (source code)
├── app.min.js          # Production version (minified + protected)
├── style.css           # Stylesheet
├── data/
│   └── dsomm-devsecops.json  # Dữ liệu DSOMM
├── scripts/
│   ├── build-dsomm-json.mjs   # Script build JSON từ YAML
│   ├── build-production.mjs   # Script build production version
│   └── create-production-index.mjs  # Script tạo production index
├── .gitignore          # Git ignore rules
├── .nojekyll           # Disable Jekyll processing
└── README.md           # File này
```

### 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

### 🙏 Credits

- **OWASP DSOMM**: [DevSecOps Maturity Model](https://owasp.org/www-project-devsecops-maturity-model/)
- **OWASP SAMM**: [Software Assurance Maturity Model](https://owasp.org/www-project-samm/)

### 📧 Liên hệ

Nếu có vấn đề hoặc bất cứ đề xuất nào để cải thiện sản phẩm, vui lòng tạo issue trên GitHub repository hoặc liên hệ tôi qua [LinkedIn](https://www.linkedin.com/in/tuatnh/)

---

## 🇬🇧 English

### Introduction

A static web application that allows self-assessment of DevSecOps maturity levels based on OWASP DevSecOps Maturity Model (DSOMM), with corresponding mapping to OWASP SAMM 2.0. Instead of debating "how far we are in DevSecOps", this tool provides specific metrics, clear criteria, and consistent results — no more "personal opinions from leadership" or "security team's gut feelings".

It's suitable for organizations that want to face reality: what level are we at, what's missing, and where should we invest to move forward. Don't expect it to be prettier than the truth. But at least, after using it, you'll know where you stand and won't talk vaguely about "we're already doing DevSecOps".

### 🌐 Live Demo

Website is published on GitHub Pages: [View demo](https://shino-337.github.io/)

### 🚀 How to Run Locally

#### Method 1: Open directly (not recommended)
- Open `index.html` directly in a modern browser (Chrome/Safari/Edge)
- ⚠️ May encounter CORS errors when loading JSON data

#### Method 2: Run static server (recommended)

**With Python 3:**
```bash
cd "DSOMM Preview"
python3 -m http.server 8080
# Open http://localhost:8080
```

**With Node.js (http-server):**
```bash
npx http-server -p 8080
# Open http://localhost:8080
```

**With PHP:**
```bash
php -S localhost:8080
# Open http://localhost:8080
```

### ✨ Features

- ✅ **DSOMM Assessment**: Tick criteria you've met, automatically calculates maturity level (1-5)
- ✅ **Visual Overview**: Radar chart displays maturity level by domain
- ✅ **SAMM Mapping**: Automatically maps DSOMM results to OWASP SAMM 2.0
- ✅ **SAMM Chart**: Radar chart displays SAMM level by function and stream
- ✅ **Multi-language**: Supports Vietnamese and English
- ✅ **Storage**: Import/Export assessment as JSON
- ✅ **Detailed Tooltips**: Hover over criteria to see description, risk, measure, implementation guide, references

### 📖 Usage

1. **Assess Criteria**: 
   - Tick the criteria (activities) you've met
   - Maturity level will be automatically calculated based on the percentage of ticked criteria

2. **View Overview**:
   - "DSOMM" tab displays overview and criteria matrix
   - "SAMM Mapping" tab displays mapping results with SAMM 2.0

3. **Storage**:
   - Click "Export Assessment" to download JSON file
   - Click "Import Assessment" to load from JSON file

4. **Switch Language**:
   - Click the language button (🌐) in the header
   - Select Vietnamese or English

### 🛠️ Project Structure

```
.
├── index.html          # Main HTML file
├── app.js              # JavaScript logic (source code)
├── app.min.js          # Production version (minified + protected)
├── style.css           # Stylesheet
├── data/
│   └── dsomm-devsecops.json  # DSOMM data
├── scripts/
│   ├── build-dsomm-json.mjs   # Script to build JSON from YAML
│   ├── build-production.mjs   # Script to build production version
│   └── create-production-index.mjs  # Script to create production index
├── .gitignore          # Git ignore rules
├── .nojekyll           # Disable Jekyll processing
└── README.md           # This file
```

### 📄 License

MIT License - See LICENSE file for more details.

### 🙏 Credits

- **OWASP DSOMM**: [DevSecOps Maturity Model](https://owasp.org/www-project-devsecops-maturity-model/)
- **OWASP SAMM**: [Software Assurance Maturity Model](https://owasp.org/www-project-samm/)

### 📧 Contact

If you have any issues or suggestions to improve the product, please create an issue on the GitHub repository or contact me via [LinkedIn](https://www.linkedin.com/in/tuatnh/)

---

[⬆ Back to top](#owasp-dsomm-assessment-tool)