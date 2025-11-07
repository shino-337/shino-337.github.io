# Cơ chế Mapping DSOMM → SAMM

## Tổng quan

Mapping tự động chuyển đổi kết quả đánh giá DSOMM sang mức độ đáp ứng OWASP SAMM 2.0 dựa trên references trong dữ liệu DSOMM.

## 1. Nguồn dữ liệu

### DSOMM Activity Structure
Mỗi activity trong DSOMM có field `references`:
```json
{
  "id": "f6f7737f-25a9-4317-8de2-09bf59f29b5b",
  "name": "Defined build process",
  "references": {
    "samm2": ["I-SB-1-A"],
    "iso27001-2017": ["12.1.1", "14.2.2"],
    "iso27001-2022": [5.37, 8.32]
  }
}
```

### SAMM Code Format
Format: `{Function}-{Practice}-{Level}-{Stream}`

**Ví dụ: `I-SB-1-A`**
- `I` = Function: **Implementation**
- `SB` = Practice: **Secure Build**
- `1` = Level: **Level 1** (mức độ SAMM 1-3)
- `A` = Stream: **Stream A** (có thể là A, B, hoặc C)

## 2. Quy trình Mapping

### Bước 1: Parse SAMM Code
```javascript
parseSAMMCode("I-SB-1-A")
// Kết quả:
{
  function: "I",
  functionName: "Implementation",
  practice: "SB",
  practiceName: "Secure Build",
  level: 1,
  stream: "A",
  code: "I-SB-1-A"
}
```

### Bước 2: Aggregate theo SAMM Practice
- **Key**: `{Function}-{Practice}` (ví dụ: `"I-SB"`)
- **Cấu trúc**: Mỗi practice có 3 levels, mỗi level có 3 streams (A, B, C)
- **Lưu trữ**: Danh sách các DSOMM activities đã được tick trong từng level/stream

**Ví dụ cấu trúc:**
```javascript
{
  "I-SB": {
    function: "I",
    functionName: "Implementation",
    practice: "SB",
    practiceName: "Secure Build",
    code: "I-SB",
    levels: {
      1: { A: [activities], B: [], C: [] },
      2: { A: [], B: [activities], C: [] },
      3: { A: [], B: [], C: [] }
    }
  }
}
```

### Bước 3: Tính mức SAMM đạt được

**Quy tắc:**
- Mức SAMM = **mức cao nhất** có **ít nhất 1 activity** được tick trong stream đó
- Duyệt từ Level 3 → Level 1
- Nếu không có activity nào được tick → mức = 0

**Ví dụ:**
```
Stream A:
- Level 3: 0 activities → không đạt
- Level 2: 2 activities → đạt Level 2
- Level 1: 1 activity → đạt Level 1
→ Kết quả: Đạt Level 2 (mức cao nhất có activity)
```

## 3. Ví dụ cụ thể

### Scenario 1: Activity đơn giản

**DSOMM Activity:**
- Name: "Defined build process"
- ID: `f6f7737f-25a9-4317-8de2-09bf59f29b5b`
- References: `["I-SB-1-A"]`
- User tick: ✅

**Kết quả Mapping:**
```
Practice: I-SB (Implementation → Secure Build)
  Stream A:
    Level 1: ✅ "Defined build process" (DSOMM Level 1)
    Level 2: (không có)
    Level 3: (không có)
  → Đạt SAMM Level 1 cho Stream A
```

### Scenario 2: Multiple activities

**DSOMM Activities:**
1. "Defined build process" → `I-SB-1-A` ✅
2. "Building in virtual environments" → `I-SB-2-A` ✅
3. "SBOM of components" → `I-SB-2-B` ✅

**Kết quả Mapping:**
```
Practice: I-SB (Implementation → Secure Build)
  Stream A:
    Level 1: ✅ "Defined build process"
    Level 2: ✅ "Building in virtual environments"
    Level 3: (không có)
  → Đạt SAMM Level 2 cho Stream A

  Stream B:
    Level 1: (không có)
    Level 2: ✅ "SBOM of components"
    Level 3: (không có)
  → Đạt SAMM Level 2 cho Stream B

  Stream C:
    Level 1-3: (không có)
  → Chưa đạt SAMM (Level 0)
```

### Scenario 3: Multiple SAMM references

**DSOMM Activity:**
- Name: "Threat modeling"
- References: `["D-TA-1-B", "D-TA-2-B"]` (có thể map tới nhiều SAMM practices/levels)

**Kết quả:**
- Practice `D-TA` (Design → Threat Assessment):
  - Stream B, Level 1: ✅
  - Stream B, Level 2: ✅
  - → Đạt SAMM Level 2 cho Stream B

## 4. Hiển thị trong UI

### Tab "SAMM Mapping" hiển thị:

1. **Tổng quan:**
   - Tổng số SAMM practices có mapping
   - Số Business Functions
   - Số practices đã đạt
   - Tỷ lệ đạt (%)

2. **Chi tiết mỗi Practice:**
   - Code và tên đầy đủ (ví dụ: `I-SB` → `Implementation → Secure Build`)
   - Mức đạt được cho từng Stream (A, B, C)
   - Danh sách DSOMM activities đã tick tương ứng

3. **Filter:**
   - Filter theo Business Function (G, D, I, V, O)
   - Filter theo Stream (A, B, C)

## 5. Lưu ý quan trọng

### Mối quan hệ DSOMM ↔ SAMM
- **1-to-many**: Một DSOMM activity có thể map tới nhiều SAMM practices/levels
- **Many-to-1**: Nhiều DSOMM activities có thể map tới cùng một SAMM practice/level
- **Không phải tất cả**: Không phải mọi DSOMM activity đều có SAMM reference

### Tính mức SAMM

**Vấn đề: DSOMM có 5 mức, SAMM chỉ có 3 mức**
- Một DSOMM activity ở mức cao (4-5) có thể map tới SAMM Level 3 (max)
- Nhưng user chưa tick các SAMM Level 1, 2 activities
- Kết quả: SAMM hiển thị Level 3 nhưng thực tế chưa đạt đủ

**Giải pháp: Tính mức tuần tự**
- **Actual Level (mức thực tế)**: Level N chỉ đạt nếu đã đạt Level 1...N-1
- **Raw Level (mức thô)**: Mức cao nhất có activity tick (không cần tuần tự)
- **Hiển thị**: 
  - Nếu actual level > 0: Hiển thị actual level (màu xanh)
  - Nếu raw level > actual level: Hiển thị "Chưa đạt (raw: X)" (màu vàng)
  - Nếu raw level = 0: Hiển thị "-" (màu xám)

**Ví dụ:**
- Stream A:
  - Level 3: 1 activity ✅ (từ DSOMM Level 5)
  - Level 2: 0 activities ❌
  - Level 1: 0 activities ❌
- Kết quả:
  - Raw Level: 3 (có activity ở Level 3)
  - Actual Level: 0 (chưa đạt Level 1, 2)
  - Hiển thị: "Chưa đạt (raw: 3)" (màu vàng - cảnh báo)

### Cập nhật real-time
- Khi tick/untick DSOMM activity → SAMM mapping tự động cập nhật
- Nếu đang ở tab SAMM → hiển thị ngay lập tức

## 6. Ví dụ thực tế từ dữ liệu

### DSOMM Activity: "Defined build process"
```json
{
  "id": "f6f7737f-25a9-4317-8de2-09bf59f29b5b",
  "name": "Defined build process",
  "level": 1,  // DSOMM Level 1
  "references": {
    "samm2": ["I-SB-1-A"]
  }
}
```

**Khi user tick activity này:**
- SAMM Practice `I-SB` (Implementation → Secure Build)
- Stream A, Level 1 → có 1 activity
- → Đạt SAMM Level 1 cho Stream A

**Khi user tick thêm activity khác cùng practice:**
- Activity khác: `I-SB-2-A` → Stream A, Level 2 có activity
- → Đạt SAMM Level 2 cho Stream A (mức cao nhất có activity)

## Kết luận

Mapping DSOMM → SAMM là quá trình tự động:
1. **Parse** SAMM codes từ DSOMM references
2. **Aggregate** activities theo SAMM practice structure
3. **Tính** mức SAMM đạt được dựa trên activities đã tick
4. **Hiển thị** kết quả mapping với tên đầy đủ và thống kê

Điều này cho phép bạn đánh giá DSOMM và xem ngay mức độ đáp ứng SAMM tương ứng.

