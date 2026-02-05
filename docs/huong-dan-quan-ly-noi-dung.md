# Hướng dẫn Quản lý Nội dung TOP10
## Tài liệu chi tiết cho người mới

---

# MỤC LỤC

- [GIỚI THIỆU TỔNG QUAN](#giới-thiệu-tổng-quan)
- [PHẦN 1: QUẢN LÝ CATEGORY](#phần-1-quản-lý-category-danh-mục)
- [PHẦN 2: QUẢN LÝ PRODUCT](#phần-2-quản-lý-product-sản-phẩm)
- [PHẦN 3: QUẢN LÝ ARTICLE](#phần-3-quản-lý-article-bài-viết)

---

# GIỚI THIỆU TỔNG QUAN

## Cấu trúc website TOP10

Website TOP10 có 3 loại nội dung chính:

### 1. Category (Danh mục)
Là nhóm chứa các sản phẩm cùng loại. Ví dụ:
- "Dịch vụ TV Streaming" chứa: Sling TV, Hulu, YouTube TV...
- "Phần mềm Antivirus" chứa: Norton, McAfee, Kaspersky...

**URL mẫu:** `https://top10.com/tv-streaming-services`

### 2. Product (Sản phẩm)
Là từng sản phẩm/dịch vụ được đánh giá trong danh mục.

**URL mẫu:** `https://top10.com/tv-streaming-services/reviews/sling-tv`

### 3. Article (Bài viết)
Là các bài blog, hướng dẫn, so sánh không theo format top 10.

**URL mẫu:** `https://top10.com/articles/cach-chon-dich-vu-streaming`

---

## Cách truy cập Admin

1. Mở trình duyệt, vào: `http://localhost:3000/admin`
2. Đăng nhập với tài khoản admin
3. Chọn mục cần quản lý từ menu bên trái

---

# PHẦN 1: QUẢN LÝ CATEGORY (Danh mục)

## 1.1. Category hiển thị ở đâu?

Một Category sẽ tạo ra **3 trang** trên website:

```
📄 Trang danh mục chính
   URL: /tv-streaming-services
   → Hiển thị danh sách top 10 sản phẩm

📄 Trang so sánh
   URL: /tv-streaming-services/comparison
   → Bảng so sánh các sản phẩm

📄 Trang đánh giá (cho từng product)
   URL: /tv-streaming-services/reviews/sling-tv
   → Chi tiết từng sản phẩm
```

---

## 1.2. TAB 1: THÔNG TIN CHUNG

### 📌 Tên danh mục
| | |
|---|---|
| **Là gì?** | Tên hiển thị của danh mục |
| **Hiển thị ở đâu?** | - Tiêu đề trang<br>- Menu điều hướng<br>- Breadcrumb<br>- Hero Section trang chủ |
| **Ví dụ** | `Dịch vụ TV Streaming` |
| **Lưu ý** | Nên ngắn gọn, dễ hiểu, có từ khóa chính |

---

### 📌 URL Slug
| | |
|---|---|
| **Là gì?** | Phần đường dẫn URL của danh mục |
| **Hiển thị ở đâu?** | Trên thanh địa chỉ trình duyệt |
| **Ví dụ** | `tv-streaming-services` → URL sẽ là `/tv-streaming-services` |
| **Quy tắc** | - Chỉ dùng chữ thường a-z<br>- Chỉ dùng số 0-9<br>- Dùng dấu gạch ngang `-` thay khoảng trắng<br>- Không dấu tiếng Việt |
| **Cách tạo** | Nhấn nút "Tạo tự động" để tạo từ tên |

**⚠️ QUAN TRỌNG:** Sau khi đã xuất bản, KHÔNG nên thay đổi slug vì sẽ ảnh hưởng đến SEO và các link cũ.

---

### 📌 Nhóm danh mục
| | |
|---|---|
| **Là gì?** | Nhóm các danh mục liên quan với nhau |
| **Hiển thị ở đâu?** | Dropdown menu trên Hero Section trang chủ |
| **Chức năng** | Khi hover vào một nhóm trên trang chủ, dropdown hiển thị các danh mục thuộc nhóm đó |
| **Ví dụ** | Nhóm "Giải trí" có thể chứa: TV Streaming, Music Streaming, Gaming... |
| **Bắt buộc?** | Không. Nếu không chọn, danh mục sẽ không hiện trên Hero Section |

---

### 📌 Icon
| | |
|---|---|
| **Là gì?** | Biểu tượng đại diện cho danh mục |
| **Hiển thị ở đâu?** | - Cạnh tên danh mục trong menu<br>- Hero Section trang chủ<br>- Breadcrumb |
| **Loại hỗ trợ** | - Emoji: `📺` `🎮` `💰`<br>- URL ảnh: `/icons/tv.svg` |
| **Ví dụ** | `📺` cho TV Streaming |

---

### 📌 Màu sắc
| | |
|---|---|
| **Là gì?** | Màu chủ đạo của danh mục |
| **Hiển thị ở đâu?** | - Background của icon<br>- Accent color trên trang danh mục<br>- Gradient trên banner |
| **Cách chọn** | Click vào các ô màu preset hoặc nhập mã màu |
| **Ví dụ** | `bg-blue-500` hoặc `#3B82F6` |

---

### 📌 Mô tả ngắn
| | |
|---|---|
| **Là gì?** | Đoạn văn mô tả ngắn về danh mục |
| **Hiển thị ở đâu?** | - Dưới tiêu đề trên trang danh mục<br>- Có thể dùng trong meta description |
| **Độ dài** | 1-2 câu, khoảng 100-150 ký tự |
| **Ví dụ** | `So sánh các dịch vụ streaming TV tốt nhất để xem phim, thể thao và giải trí.` |

---

### 📌 Tiêu đề Meta (Meta Title)
| | |
|---|---|
| **Là gì?** | Tiêu đề hiển thị trên kết quả tìm kiếm Google |
| **Hiển thị ở đâu?** | - Tab trình duyệt<br>- Kết quả tìm kiếm Google<br>- Khi share link trên Facebook/Twitter |
| **Độ dài tối ưu** | 50-60 ký tự (Google cắt nếu dài hơn) |
| **Công thức** | `[Từ khóa chính] [Năm] | TOP10` |
| **Ví dụ** | `Top 10 Dịch vụ TV Streaming Tốt Nhất 2026 \| TOP10` |

```
Kết quả Google sẽ hiển thị như sau:
┌─────────────────────────────────────────────────────┐
│ Top 10 Dịch vụ TV Streaming Tốt Nhất 2026 | TOP10  │  ← Meta Title
│ https://top10.com/tv-streaming-services            │  ← URL
│ So sánh và đánh giá chi tiết các dịch vụ...        │  ← Meta Description
└─────────────────────────────────────────────────────┘
```

---

### 📌 Mô tả Meta (Meta Description)
| | |
|---|---|
| **Là gì?** | Đoạn mô tả hiển thị dưới tiêu đề trên Google |
| **Hiển thị ở đâu?** | - Kết quả tìm kiếm Google<br>- Preview khi share link |
| **Độ dài tối ưu** | 150-160 ký tự |
| **Nội dung nên có** | - Từ khóa chính<br>- Lợi ích cho người đọc<br>- Call-to-action |
| **Ví dụ** | `Khám phá top 10 dịch vụ TV streaming tốt nhất 2026. So sánh giá, tính năng, ưu nhược điểm để chọn gói phù hợp với bạn.` |

---

### 📌 URL ảnh OG (Open Graph Image)
| | |
|---|---|
| **Là gì?** | Ảnh hiển thị khi share link lên mạng xã hội |
| **Hiển thị ở đâu?** | - Facebook khi share link<br>- Twitter khi share link<br>- LinkedIn, Zalo... |
| **Kích thước** | 1200x630 pixel |
| **Lưu ý** | Nên có text trên ảnh vì ảnh này sẽ thu hút click |

```
Khi share lên Facebook:
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [OG Image hiển         │   │
│  │       thị ở đây]            │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  Top 10 Dịch vụ TV Streaming...    │
│  So sánh các dịch vụ streaming...  │
└─────────────────────────────────────┘
```

---

### 📌 Đánh dấu nổi bật (Featured)
| | |
|---|---|
| **Là gì?** | Checkbox đánh dấu danh mục nổi bật |
| **Chức năng** | Danh mục nổi bật có thể được ưu tiên hiển thị |
| **Hiển thị ở đâu?** | Tùy cấu hình frontend |
| **Bắt buộc?** | Không |

---

### 📌 Thứ tự (Order)
| | |
|---|---|
| **Là gì?** | Số thứ tự sắp xếp danh mục |
| **Chức năng** | Danh mục có số nhỏ hơn sẽ hiển thị trước |
| **Ví dụ** | Order = 1 sẽ hiển thị trước Order = 2 |
| **Mặc định** | 0 |

---

## 1.3. TAB 2: BANNER & HIỂN THỊ

### 📌 Ảnh Banner (Hero Image)
| | |
|---|---|
| **Là gì?** | Ảnh nền lớn ở đầu trang danh mục |
| **Hiển thị ở đâu?** | Phần hero section ở đầu trang `/[category]` |
| **Kích thước đề xuất** | 1920x600 pixel |
| **Dung lượng** | Dưới 500KB |
| **Định dạng** | JPG hoặc WebP |

```
┌─────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░ ẢNH BANNER ░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                                         │
│         Top 10 Dịch vụ TV Streaming 2026               │  ← Tiêu đề Banner
│         So sánh các dịch vụ tốt nhất...                │  ← Nội dung giới thiệu
│                                                         │
│         👤 Nguyễn Văn A  •  Cập nhật: 15/01/2026       │  ← Tác giả
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 📌 Tiêu đề Banner (Hero Title)
| | |
|---|---|
| **Là gì?** | Tiêu đề lớn hiển thị trên banner |
| **Hiển thị ở đâu?** | Trung tâm phần hero section |
| **Khác với Meta Title** | Meta Title cho SEO, Hero Title cho hiển thị |
| **Nên có** | - Từ khóa chính<br>- Năm hiện tại<br>- Hấp dẫn, rõ ràng |
| **Ví dụ** | `Top 10 Dịch vụ TV Streaming Tốt Nhất Năm 2026` |

---

### 📌 Nội dung giới thiệu (Intro Content)
| | |
|---|---|
| **Là gì?** | Đoạn văn giới thiệu dưới tiêu đề banner |
| **Hiển thị ở đâu?** | Ngay dưới Hero Title trên trang danh mục |
| **Chức năng** | - Giới thiệu nhanh về danh mục<br>- Giải thích tiêu chí đánh giá<br>- Thu hút người đọc |
| **Hỗ trợ** | Rich text (bold, italic, link) |
| **Độ dài** | 2-3 đoạn văn ngắn |

---

### 📌 Tác giả
| | |
|---|---|
| **Là gì?** | Người chịu trách nhiệm nội dung danh mục |
| **Hiển thị ở đâu?** | - Trên banner (avatar + tên)<br>- Cuối trang đánh giá |
| **Chức năng** | Tăng độ tin cậy (E-E-A-T cho SEO) |
| **Cách chọn** | Chọn từ dropdown danh sách Authors |

---

### 📌 Thứ tự sản phẩm (Product Order)
| | |
|---|---|
| **Là gì?** | Sắp xếp thứ tự hiển thị các sản phẩm trong danh mục |
| **Hiển thị ở đâu?** | - Danh sách top 10 trên trang danh mục<br>- Trang so sánh |
| **Cách dùng** | Kéo thả sản phẩm để sắp xếp |
| **Lưu ý** | Sản phẩm đầu tiên = #1 trong top 10 |

```
Kéo thả để sắp xếp:
┌─────────────────────────────┐
│ ☰ 1. Sling TV              │ ← Kéo để đổi vị trí
│ ☰ 2. YouTube TV            │
│ ☰ 3. Hulu + Live TV        │
│ ☰ 4. fuboTV                │
│ ...                        │
└─────────────────────────────┘
```

---

### 📌 Tiêu chí đánh giá (Criteria Definitions)
| | |
|---|---|
| **Là gì?** | Định nghĩa các tiêu chí dùng để chấm điểm sản phẩm |
| **Hiển thị ở đâu?** | - Bảng điểm trên trang đánh giá sản phẩm<br>- Phần methodology |
| **Cách thêm** | Thêm từng tiêu chí với tên và mô tả |
| **Ví dụ cho TV Streaming** | - Chất lượng nội dung<br>- Giá trị (Value)<br>- Tính năng<br>- Dễ sử dụng<br>- Hỗ trợ khách hàng |

---

### 📌 Highlight Definitions
| | |
|---|---|
| **Là gì?** | Định nghĩa các thông tin nổi bật hiển thị trong card sản phẩm |
| **Hiển thị ở đâu?** | Phần highlights trong card sản phẩm |
| **Thường dùng** | - Starting Price (Giá khởi điểm)<br>- Trial Period (Thời gian dùng thử)<br>- Best For (Phù hợp cho) |

```
Card sản phẩm hiển thị:
┌─────────────────────────────────┐
│  🏆 #1 Sling TV                 │
│  ────────────────────────────── │
│  Starting Price: $40/tháng      │ ← Highlight 1
│  Trial Period: 3 ngày           │ ← Highlight 2
│  Best For: Người tiết kiệm      │ ← Highlight 3
└─────────────────────────────────┘
```

---

## 1.4. TAB 3: NỘI DUNG & FAQ

### 📌 Review List Intro
| | |
|---|---|
| **Là gì?** | Tiêu đề và ảnh cho phần giới thiệu danh sách đánh giá |
| **Hiển thị ở đâu?** | Đầu phần danh sách top 10 |
| **Bao gồm** | - Tiêu đề section<br>- Ảnh minh họa |

---

### 📌 10 Điều Cần Biết (Ten Things To Know)
| | |
|---|---|
| **Là gì?** | Danh sách 10 điểm quan trọng về danh mục |
| **Hiển thị ở đâu?** | Section riêng trên trang danh mục |
| **Chức năng** | - Tóm tắt nhanh cho người đọc<br>- Tốt cho SEO (featured snippets) |
| **Cách viết** | Mỗi mục là 1 fact ngắn gọn, hữu ích |

**Ví dụ cho TV Streaming:**
```
1. Giá thường dao động từ $30-$75/tháng
2. Hầu hết dịch vụ đều có bản dùng thử miễn phí 3-7 ngày
3. Cần tốc độ internet tối thiểu 25Mbps để xem 4K
4. Có thể xem trên nhiều thiết bị: Smart TV, điện thoại, máy tính
5. Một số dịch vụ có DVR cloud để ghi lại chương trình
...
```

---

### 📌 Bài viết liên quan (Must Read Articles)
| | |
|---|---|
| **Là gì?** | Các bài article liên quan đến danh mục |
| **Hiển thị ở đâu?** | Section "Bài viết nên đọc" trên trang danh mục |
| **Cách chọn** | Tick chọn từ danh sách articles có sẵn |
| **Số lượng** | 2-4 bài |

---

### 📌 Phương pháp đánh giá (Methodology)
| | |
|---|---|
| **Là gì?** | Giải thích cách đội ngũ đánh giá sản phẩm |
| **Hiển thị ở đâu?** | Section "Phương pháp đánh giá" cuối trang |
| **Chức năng** | - Tăng độ tin cậy<br>- Minh bạch với người đọc<br>- Tốt cho E-E-A-T (SEO) |
| **Bao gồm** | - Đoạn giới thiệu<br>- Danh sách tiêu chí + trọng số |

**Ví dụ:**
```
Giới thiệu:
"Đội ngũ TOP10 đã dành hơn 100 giờ để test và đánh giá
từng dịch vụ TV streaming. Chúng tôi đăng ký thực tế,
xem trên nhiều thiết bị và đánh giá dựa trên các tiêu chí sau:"

Tiêu chí:
- Chất lượng nội dung: 30%
- Giá trị (Value): 25%
- Tính năng: 25%
- Hỗ trợ khách hàng: 20%
```

---

### 📌 Explore Cards
| | |
|---|---|
| **Là gì?** | Các card liên kết đến nội dung liên quan |
| **Hiển thị ở đâu?** | Section "Khám phá thêm" trên trang |
| **Mỗi card gồm** | - Title<br>- Description<br>- Link<br>- Image |
| **Số lượng** | 3-4 cards |

**Ví dụ:**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   [Ảnh]     │ │   [Ảnh]     │ │   [Ảnh]     │
│             │ │             │ │             │
│ So sánh giá │ │ Hướng dẫn   │ │ Tin tức     │
│ các gói     │ │ chọn dịch vụ│ │ mới nhất    │
└─────────────┘ └─────────────┘ └─────────────┘
```

---

### 📌 FAQ (Câu hỏi thường gặp)
| | |
|---|---|
| **Là gì?** | Danh sách câu hỏi và trả lời phổ biến |
| **Hiển thị ở đâu?** | - Section FAQ cuối trang<br>- Có thể hiển thị rich snippet trên Google |
| **Chức năng** | - Giải đáp thắc mắc người dùng<br>- Tốt cho SEO (FAQ rich snippets) |
| **Số lượng tối thiểu** | 5 câu hỏi |

**Cách viết FAQ hiệu quả:**
```
❌ Sai: "Dịch vụ nào tốt nhất?"
✅ Đúng: "Dịch vụ TV streaming nào có nhiều kênh thể thao nhất?"

❌ Sai: "Giá bao nhiêu?"
✅ Đúng: "Chi phí trung bình hàng tháng cho dịch vụ TV streaming là bao nhiêu?"
```

---

### 📌 Bottom Content
| | |
|---|---|
| **Là gì?** | Nội dung bổ sung cuối trang |
| **Hiển thị ở đâu?** | Cuối trang danh mục, trước footer |
| **Chức năng** | - Thêm nội dung cho SEO<br>- Đặt các link nội bộ<br>- Thông tin bổ sung |
| **Hỗ trợ** | Rich text editor |

---

## 1.5. TAB 4: TRANG SO SÁNH

### 📌 Tiêu đề trang so sánh
| | |
|---|---|
| **Là gì?** | Tiêu đề hiển thị trên trang `/[category]/comparison` |
| **Ví dụ** | `So sánh Dịch vụ TV Streaming 2026` |

---

### 📌 Phụ đề
| | |
|---|---|
| **Là gì?** | Mô tả ngắn dưới tiêu đề |
| **Ví dụ** | `Tìm dịch vụ streaming phù hợp nhất với nhu cầu của bạn` |

---

### 📌 Top 3 Products Bar
| | |
|---|---|
| **Là gì?** | Thanh hiển thị 3 sản phẩm hàng đầu ở đầu trang |
| **Hiển thị ở đâu?** | Đầu trang so sánh, dạng podium |

```
      ┌─────────┐
      │ 🥇 #1   │
      │ Sling   │
┌─────┴─────┐   └─────┬─────┐
│ 🥈 #2     │         │ 🥉 #3│
│ YouTube   │         │ Hulu │
└───────────┘         └──────┘
```

**Các trường:**
- **Bật/Tắt**: Hiển thị hay ẩn phần này
- **Tiêu đề**: VD: "Top 3 Lựa Chọn Của Chúng Tôi"
- **Chọn 3 sản phẩm**: Kéo thả để chọn
- **Ribbon**: Badge text như "Khuyến nghị"

---

### 📌 Sidebar phải
| | |
|---|---|
| **Là gì?** | Cột sidebar bên phải trang so sánh |
| **Chức năng** | Hiển thị sản phẩm được khuyến nghị |
| **Cài đặt** | - Bật/Tắt<br>- Chọn sản phẩm hiển thị |

---

### 📌 Sidebar trái
| | |
|---|---|
| **Là gì?** | Cột sidebar bên trái với mục lục |
| **Mặc định** | Bật |

---

### 📌 Social Proof Count
| | |
|---|---|
| **Là gì?** | Số lượt xem/tương tác hiển thị |
| **Hiển thị** | VD: "1,234,567 người đã xem tuần này" |
| **Chức năng** | Tạo FOMO, tăng trust |

---

### 📌 Score Breakdown
| | |
|---|---|
| **Là gì?** | Bảng phân tích điểm số chi tiết |
| **Hiển thị ở đâu?** | Sidebar hoặc section riêng trên trang so sánh |

**Cấu hình mỗi mục:**
- Name: Tên tiêu chí (VD: "Độ phổ biến")
- Description: Mô tả (VD: "Dựa trên lượt truy cập 7 ngày qua")
- Score: Điểm số (VD: 9.0)

---

# PHẦN 2: QUẢN LÝ PRODUCT (Sản phẩm)

## 2.1. Product hiển thị ở đâu?

Một Product xuất hiện ở **4 nơi** chính:

```
1️⃣ Card trong danh sách top 10
   Trang: /[category]
   → Card nhỏ với logo, điểm số, features

2️⃣ Card trên trang so sánh
   Trang: /[category]/comparison
   → Card chi tiết hơn với bảng so sánh

3️⃣ Trang đánh giá chi tiết
   Trang: /[category]/reviews/[product-slug]
   → Bài đánh giá đầy đủ

4️⃣ Sidebar "Sản phẩm liên quan"
   → Hiển thị trong articles và review khác
```

---

## 2.2. TAB 1: THÔNG TIN CƠ BẢN

### 📌 Tên sản phẩm
| | |
|---|---|
| **Là gì?** | Tên hiển thị của sản phẩm/dịch vụ |
| **Hiển thị ở đâu?** | Khắp nơi: card, tiêu đề, menu... |
| **Ví dụ** | `Sling TV`, `Norton Antivirus`, `eharmony` |

---

### 📌 URL Slug
| | |
|---|---|
| **Là gì?** | Phần URL định danh sản phẩm |
| **Ví dụ** | `sling-tv` → URL: `/tv-streaming/reviews/sling-tv` |
| **Quy tắc** | Chữ thường, số, gạch ngang. Không dấu. |

---

### 📌 URL Logo
| | |
|---|---|
| **Là gì?** | Ảnh logo của sản phẩm |
| **Hiển thị ở đâu?** | - Card sản phẩm<br>- Trang đánh giá<br>- Sidebar |
| **Kích thước** | 200x200 pixel, nền trong suốt |
| **Định dạng** | PNG hoặc SVG |
| **Cách thêm** | Upload hoặc paste URL |

---

### 📌 Danh mục
| | |
|---|---|
| **Là gì?** | Category mà sản phẩm thuộc về |
| **Bắt buộc?** | Có |
| **Ví dụ** | Sling TV → thuộc "TV Streaming Services" |

---

### 📌 Tác giả
| | |
|---|---|
| **Là gì?** | Người viết bài đánh giá sản phẩm |
| **Hiển thị ở đâu?** | - Byline trên trang đánh giá<br>- Bio cuối bài |

---

### 📌 URL Affiliate
| | |
|---|---|
| **Là gì?** | Link affiliate/giới thiệu đến trang sản phẩm |
| **Chức năng** | Khi user click "Visit Site", họ được chuyển đến link này |
| **Ví dụ** | `https://www.sling.com/?affiliate=top10` |
| **Quan trọng** | Đây là link kiếm tiền chính của website! |

---

### 📌 Văn bản nút CTA
| | |
|---|---|
| **Là gì?** | Text hiển thị trên nút gọi hành động |
| **Mặc định** | `Visit Site` |
| **Có thể đổi** | `Xem trang web`, `Đăng ký ngay`, `Dùng thử miễn phí` |

```
┌─────────────────────┐
│   [Xem trang web]   │  ← Nút CTA
└─────────────────────┘
```

---

### 📌 URL trang đánh giá
| | |
|---|---|
| **Là gì?** | Link nội bộ đến trang đánh giá chi tiết |
| **Tự động tạo** | Nhấn "Tạo tự động" để generate từ category + slug |
| **Ví dụ** | `/tv-streaming-services/reviews/sling-tv` |

---

### 📌 Trạng thái
| | |
|---|---|
| **Draft** | Bản nháp - chưa hiển thị công khai |
| **Published** | Đã xuất bản - hiển thị trên website |
| **Lưu ý** | Luôn để Draft khi đang soạn, chuyển Published khi hoàn tất |

---

## 2.3. TAB 2: HIỂN THỊ DANH MỤC

Tab này cấu hình cách sản phẩm hiển thị trong **card** trên trang danh mục và so sánh.

### 📌 Vị trí xếp hạng (Rank)
| | |
|---|---|
| **Là gì?** | Thứ hạng của sản phẩm trong top 10 |
| **Giá trị** | 1-10 |
| **Hiển thị** | Số thứ tự trên card: #1, #2, #3... |
| **Lưu ý** | Nên khớp với Product Order trong Category |

---

### 📌 Huy hiệu (Ribbon)
| | |
|---|---|
| **Là gì?** | Badge đặc biệt trên card sản phẩm |
| **Hiển thị ở đâu?** | Góc trên card sản phẩm |
| **Các option** | - Best Overall (Tốt nhất tổng thể)<br>- Editor's Choice (Lựa chọn biên tập)<br>- Best Value (Giá trị tốt nhất)<br>- Most Popular (Phổ biến nhất)<br>- Rising Star (Ngôi sao mới) |

```
┌──────────────────────────────┐
│ 🏆 Best Overall              │  ← Ribbon
│ ──────────────────────────── │
│ #1 Sling TV                  │
│ ...                          │
└──────────────────────────────┘
```

---

### 📌 Khẩu hiệu (Tagline)
| | |
|---|---|
| **Là gì?** | Câu slogan ngắn dưới tên sản phẩm |
| **Hiển thị** | Dưới tên trong card |
| **Độ dài** | 5-10 từ |
| **Ví dụ** | `Tự do tạo gói TV theo ý bạn` |

---

### 📌 Tóm tắt (Bottom Line)
| | |
|---|---|
| **Là gì?** | Mô tả ngắn về sản phẩm |
| **Hiển thị** | Trong card sản phẩm, dưới các thông tin chính |
| **Độ dài** | 2-3 câu |
| **Nội dung** | Tóm tắt ưu điểm chính, phù hợp với ai |

**Ví dụ:**
```
Sling TV là lựa chọn tuyệt vời cho những người muốn cắt giảm chi phí
cable TV. Với các gói linh hoạt và giá khởi điểm thấp, bạn có thể
tùy chỉnh danh sách kênh theo nhu cầu.
```

---

### 📌 Phù hợp cho (Best For)
| | |
|---|---|
| **Là gì?** | Mô tả đối tượng phù hợp nhất |
| **Hiển thị** | Trong phần highlights của card |
| **Ví dụ** | `Người dùng quan tâm đến ngân sách` |

---

### 📌 Giá khởi điểm (Base Price)
| | |
|---|---|
| **Là gì?** | Giá cơ bản của sản phẩm |
| **Hiển thị** | Trong phần highlights |
| **Format** | Text tự do |
| **Ví dụ** | `$40/tháng`, `Từ $19.99`, `Miễn phí` |

---

### 📌 Điểm tổng thể (Overall Score)
| | |
|---|---|
| **Là gì?** | Điểm đánh giá chính của sản phẩm |
| **Thang điểm** | 0-10 (có thể dùng số thập phân: 9.2, 8.7...) |
| **Hiển thị** | - Badge điểm trên card<br>- Trang đánh giá<br>- Trang so sánh |
| **Dùng để** | Sắp xếp sản phẩm |

```
┌─────────────────┐
│     9.2         │  ← Overall Score
│   Excellent     │  ← Score Label
└─────────────────┘
```

---

### 📌 Nhãn điểm (Score Label)
| | |
|---|---|
| **Là gì?** | Text mô tả mức điểm |
| **Các mức** | - Excellent (9.0+)<br>- Very Good (8.0-8.9)<br>- Good (7.0-7.9)<br>- Fair (6.0-6.9)<br>- Poor (<6.0) |
| **Tự động?** | Có thể tự động dựa trên Overall Score |

---

### 📌 Điểm chi tiết (Scores)
| | |
|---|---|
| **Là gì?** | Điểm theo từng tiêu chí |
| **Các tiêu chí mặc định** | - Value<br>- Features<br>- Ease of Use<br>- Support<br>- Quality |
| **Thang điểm** | 0-10 |
| **Hiển thị** | Bảng điểm trên trang đánh giá |

```
Bảng điểm chi tiết:
┌────────────────────┬───────┐
│ Value              │  9.0  │
│ Features           │  8.5  │
│ Ease of Use        │  9.2  │
│ Support            │  8.0  │
│ Quality            │  9.5  │
├────────────────────┼───────┤
│ Overall            │  9.2  │
└────────────────────┴───────┘
```

---

### 📌 Thông tin nổi bật (Highlights)
| | |
|---|---|
| **Là gì?** | 3 thông tin chính hiển thị trong card |
| **Các trường** | - Starting Price<br>- Trial Period<br>- Best For |
| **Hiển thị** | Phần đầu card sản phẩm |

---

### 📌 Danh sách tính năng (Features)
| | |
|---|---|
| **Là gì?** | Danh sách các tính năng với dấu tick ✓ |
| **Hiển thị** | Trong card sản phẩm |
| **Số lượng** | 4-8 tính năng |
| **Tùy chọn** | Có thể đánh dấu **Bold** cho tính năng nổi bật |

```
✓ 50+ kênh live
✓ Cloud DVR 50 giờ
✓ 3 thiết bị đồng thời  ← Bold
✓ Hỗ trợ 4K
✓ Xem lại 3 ngày
```

---

### 📌 Trích dẫn khách hàng (Quote)
| | |
|---|---|
| **Là gì?** | Lời nhận xét từ khách hàng thực |
| **Hiển thị** | Cuối card sản phẩm |
| **Bao gồm** | - Nội dung trích dẫn<br>- Tên nguồn<br>- Ngày |

```
"Tôi đã tiết kiệm được $50/tháng so với cable TV truyền thống.
Chất lượng hình ảnh và âm thanh rất tốt!"

— Nguyễn Văn A, Tháng 1/2026
```

---

## 2.4. TAB 3: NỘI DUNG ĐÁNH GIÁ

Tab này cấu hình nội dung cho **trang đánh giá chi tiết** `/[category]/reviews/[product]`

### 📌 Tiêu đề đánh giá (Review Title)
| | |
|---|---|
| **Là gì?** | Tiêu đề H1 của trang đánh giá |
| **Hiển thị** | Đầu trang đánh giá |
| **Khác tên sản phẩm** | Có thể dài và mô tả hơn |
| **Ví dụ** | `Đánh giá Sling TV 2026: Liệu Có Đáng Để Cắt Dây Cable?` |

---

### 📌 Phụ đề (Review Subtitle)
| | |
|---|---|
| **Là gì?** | Dòng mô tả ngắn dưới tiêu đề |
| **Hiển thị** | Ngay dưới Review Title |
| **Ví dụ** | `Một lựa chọn streaming TV linh hoạt với giá cả phải chăng` |

---

### 📌 Ảnh Banner (Review Hero Image)
| | |
|---|---|
| **Là gì?** | Ảnh hero lớn trên trang đánh giá |
| **Kích thước** | 1920x600 pixel |
| **Nội dung ảnh** | Screenshot app, ảnh sản phẩm, hoặc ảnh minh họa |

---

### 📌 Đánh giá người dùng (Rating)
| | |
|---|---|
| **Là gì?** | Điểm rating trung bình từ người dùng |
| **Thang điểm** | 1-5 sao |
| **Hiển thị** | Badge sao trên trang đánh giá |
| **Khác Overall Score** | Rating là từ users, Overall Score là từ biên tập |

```
⭐⭐⭐⭐☆ 4.2 (3,598 đánh giá)
```

---

### 📌 Số lượt đánh giá (Review Count)
| | |
|---|---|
| **Là gì?** | Số người đã đánh giá |
| **Format** | Text tự do |
| **Ví dụ** | `3,598 đánh giá`, `Based on 500+ reviews` |

---

### 📌 Tóm tắt Banner (Hero Summary)
| | |
|---|---|
| **Là gì?** | Đoạn mở đầu tóm tắt bài đánh giá |
| **Hiển thị ở đâu?** | - Phần hero trên trang đánh giá<br>- Mini-review trong card "Closer Look" |
| **Hỗ trợ** | Rich text (bold, italic, link) |
| **Độ dài** | 2-3 đoạn ngắn |

**Ví dụ:**
```html
<p>Sling TV là một trong những dịch vụ streaming TV trực tiếp
<strong>giá rẻ nhất</strong> trên thị trường, với gói cơ bản
chỉ từ $40/tháng.</p>

<p>Nếu bạn đang tìm cách cắt giảm hóa đơn cable mà vẫn muốn
xem TV trực tiếp, Sling TV là lựa chọn đáng cân nhắc.</p>
```

---

### 📌 Video URL
| | |
|---|---|
| **Là gì?** | Link đến video review (YouTube, Vimeo...) |
| **Hiển thị** | Embed video trên trang đánh giá |
| **Hỗ trợ** | - YouTube: `https://www.youtube.com/watch?v=xxxxx`<br>- Vimeo: `https://vimeo.com/xxxxx`<br>- Dailymotion |

---

### 📌 Ưu điểm (Pros)
| | |
|---|---|
| **Là gì?** | Danh sách những điểm tốt của sản phẩm |
| **Hiển thị** | Section Pros & Cons trên trang đánh giá |
| **Số lượng** | 4-6 mục |
| **Cách viết** | Ngắn gọn, cụ thể, bắt đầu bằng động từ |

**Ví dụ:**
```
👍 Pros:
• Giá khởi điểm thấp nhất thị trường
• Gói linh hoạt, tùy chỉnh theo nhu cầu
• Hỗ trợ nhiều thiết bị
• Không cần hợp đồng, hủy bất cứ lúc nào
• DVR cloud miễn phí
```

---

### 📌 Nhược điểm (Cons)
| | |
|---|---|
| **Là gì?** | Danh sách những điểm chưa tốt |
| **Hiển thị** | Section Pros & Cons |
| **Số lượng** | 3-5 mục |
| **Cách viết** | Trung thực, khách quan |

**Ví dụ:**
```
👎 Cons:
• Ít kênh địa phương
• Chỉ 1 luồng xem với gói cơ bản
• Giao diện khó dùng trên một số thiết bị
• Không có PBS
```

---

### 📌 Nội dung chính (Main Content)
| | |
|---|---|
| **Là gì?** | Bài đánh giá chi tiết đầy đủ |
| **Hiển thị** | Body chính của trang đánh giá |
| **Hỗ trợ** | Rich text với H2, H3, hình ảnh, bảng |
| **Độ dài** | 1500-3000 từ |

**Cấu trúc đề xuất:**
```
## Tổng quan về [Sản phẩm]
(Giới thiệu chung)

## Tính năng chính
(Chi tiết các tính năng)

## Giá cả và gói cước
(Bảng giá, so sánh gói)

## Trải nghiệm sử dụng
(Đánh giá thực tế)

## So sánh với đối thủ
(So với các sản phẩm khác)

## Ai nên dùng [Sản phẩm]?
(Đối tượng phù hợp)
```

---

### 📌 Thư viện ảnh (Images)
| | |
|---|---|
| **Là gì?** | Các ảnh bổ sung cho bài đánh giá |
| **Hiển thị** | Gallery hoặc trong nội dung |
| **Loại ảnh** | Screenshots, infographics, ảnh giao diện |

---

## 2.5. TAB 4: FAQ & SEO

### 📌 Câu hỏi thường gặp (FAQs)
| | |
|---|---|
| **Là gì?** | Q&A về sản phẩm cụ thể |
| **Hiển thị** | Section FAQ cuối trang đánh giá |
| **Số lượng** | 3-5 câu hỏi |

**Ví dụ cho Sling TV:**
```
Q: Sling TV có bao nhiêu kênh?
A: Sling Orange có 30+ kênh, Sling Blue có 40+ kênh...

Q: Có thể xem trên những thiết bị nào?
A: Sling TV hỗ trợ Roku, Fire TV, Apple TV, Android, iOS...

Q: Sling TV có hợp đồng không?
A: Không, bạn có thể hủy bất cứ lúc nào...
```

---

### 📌 Meta Title
| | |
|---|---|
| **Ví dụ** | `Đánh giá Sling TV 2026: Ưu nhược điểm chi tiết \| TOP10` |
| **Độ dài** | 50-60 ký tự |

---

### 📌 Meta Description
| | |
|---|---|
| **Ví dụ** | `Đọc đánh giá chi tiết Sling TV 2026. So sánh tính năng, giá cả, ưu nhược điểm để xem Sling TV có phù hợp với bạn không.` |
| **Độ dài** | 150-160 ký tự |

---

### 📌 Sản phẩm liên quan
| | |
|---|---|
| **Là gì?** | Link đến các sản phẩm tương tự |
| **Hiển thị** | Section "Có thể bạn quan tâm" |
| **Cách nhập** | ID sản phẩm, phân cách bằng dấu phẩy |

---

# PHẦN 3: QUẢN LÝ ARTICLE (Bài viết)

## 3.1. Article hiển thị ở đâu?

```
📄 Trang bài viết
   URL: /articles/[slug]

📄 Danh sách bài viết
   URL: /articles

📄 Section "Bài viết liên quan" trong Category
```

---

## 3.2. CÁC LOẠI BÀI VIẾT

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **Charticle** | Bài so sánh có product cards | "Top 5 Laptop Gaming Tốt Nhất" |
| **Blog** | Bài blog thông thường | "Cách Chọn Dịch Vụ Streaming Phù Hợp" |
| **Guide** | Hướng dẫn chuyên sâu | "Hướng Dẫn A-Z Về TV Streaming" |

---

## 3.3. VÙNG SOẠN THẢO CHÍNH

### 📌 Tiêu đề (Title)
| | |
|---|---|
| **Là gì?** | Tiêu đề chính của bài viết |
| **Hiển thị** | - H1 trên trang bài viết<br>- Danh sách bài viết<br>- Kết quả tìm kiếm |
| **Độ dài** | 50-70 ký tự |

---

### 📌 Phụ đề (Subtitle)
| | |
|---|---|
| **Là gì?** | Mô tả ngắn bổ sung cho tiêu đề |
| **Hiển thị** | Dưới tiêu đề chính |
| **Bắt buộc?** | Không |

---

### 📌 Tóm tắt (Excerpt)
| | |
|---|---|
| **Là gì?** | Đoạn mô tả ngắn về bài viết |
| **Hiển thị** | - Card bài viết trong danh sách<br>- Meta description (nếu không điền riêng) |
| **Độ dài** | 150-300 ký tự |

---

### 📌 Nội dung chính (Content)
| | |
|---|---|
| **Là gì?** | Nội dung đầy đủ của bài viết |
| **Editor** | Rich text với đầy đủ tính năng |

**Tính năng editor:**
- Heading H2, H3
- Bold, Italic, Underline
- Link
- Danh sách (bullet, number)
- Hình ảnh
- Bảng
- Quote

---

### 📌 Chèn CTA sản phẩm
| | |
|---|---|
| **Là gì?** | Chèn hộp CTA sản phẩm vào bài viết |
| **Cú pháp** | `{{product:sling-tv}}` |
| **Cách dùng** | Click nút "Chèn CTA sản phẩm" → chọn sản phẩm |
| **Hiển thị** | Hộp CTA với logo, tên, nút "Visit Site" |

```
Khi viết:
... nội dung bài viết ...
{{product:sling-tv}}
... tiếp tục nội dung ...

Sẽ hiển thị:
... nội dung bài viết ...
┌─────────────────────────────────────┐
│ [Logo] Sling TV                     │
│ Dịch vụ streaming TV giá rẻ         │
│ [Xem trang web]                     │
└─────────────────────────────────────┘
... tiếp tục nội dung ...
```

---

## 3.4. SIDEBAR CẤU HÌNH

### 📌 Trạng thái (Status)
| | |
|---|---|
| **Draft** | Bản nháp - chưa công khai |
| **Published** | Đã xuất bản - hiển thị trên website |

---

### 📌 URL Slug
| | |
|---|---|
| **Là gì?** | Đường dẫn URL của bài viết |
| **Ví dụ** | `cach-chon-dich-vu-streaming` → `/articles/cach-chon-dich-vu-streaming` |

---

### 📌 Loại bài viết (Article Type)
| | |
|---|---|
| **Charticle** | Có product cards nhúng |
| **Blog** | Bài blog thường |
| **Guide** | Hướng dẫn chi tiết |

---

### 📌 Danh mục
| | |
|---|---|
| **Là gì?** | Category liên quan đến bài viết |
| **Chức năng** | - Phân loại bài viết<br>- Hiển thị trong category đó |

---

### 📌 Tác giả
| | |
|---|---|
| **Là gì?** | Người viết bài |
| **Hiển thị** | Byline và bio cuối bài |

---

### 📌 Ảnh đại diện (Featured Image)
| | |
|---|---|
| **Là gì?** | Thumbnail của bài viết |
| **Hiển thị** | - Card bài viết<br>- Hero section<br>- Social sharing |
| **Kích thước** | 1200x630 pixel |

---

### 📌 Alt Text
| | |
|---|---|
| **Là gì?** | Mô tả ảnh cho SEO và accessibility |
| **Ví dụ** | `So sánh các dịch vụ TV streaming hàng đầu 2026` |

---

### 📌 Sản phẩm liên quan
| | |
|---|---|
| **Là gì?** | Các sản phẩm được đề cập trong bài |
| **Cách chọn** | Tick checkbox các sản phẩm |
| **Hiển thị** | Sidebar "Sản phẩm trong bài viết" |

---

### 📌 Mục lục (TOC)
| | |
|---|---|
| **Là gì?** | Table of Contents tự động |
| **Tự động tạo** | Từ các heading H2, H3 trong nội dung |
| **Hiển thị** | Sidebar hoặc đầu bài viết |

---

### 📌 SEO Settings
| Trường | Độ dài tối ưu |
|--------|---------------|
| Meta Title | 50-60 ký tự |
| Meta Description | 150-160 ký tự |
| OG Image | 1200x630 pixel |

---

# PHỤ LỤC

## Checklist nhanh

### ✅ Category hoàn chỉnh
- [ ] Tên + Slug + Icon + Màu
- [ ] Meta Title + Meta Description
- [ ] Ảnh Banner + Tiêu đề Banner
- [ ] Nội dung giới thiệu
- [ ] Tác giả
- [ ] Thứ tự sản phẩm
- [ ] 10 Things To Know
- [ ] Methodology
- [ ] Ít nhất 5 FAQ
- [ ] Cấu hình trang So sánh

### ✅ Product hoàn chỉnh
- [ ] Tên + Slug + Logo
- [ ] Danh mục + Tác giả
- [ ] URL Affiliate + CTA Text
- [ ] Rank + Ribbon (nếu có)
- [ ] Bottom Line + Tagline
- [ ] Overall Score + Score Label
- [ ] Điểm chi tiết (5 tiêu chí)
- [ ] Highlights (3 mục)
- [ ] Features (4-8 mục)
- [ ] Review Title + Hero Image
- [ ] Hero Summary
- [ ] Pros (4-6) + Cons (3-5)
- [ ] Main Content (1500+ từ)
- [ ] FAQ (3-5 câu)
- [ ] Meta Title + Description
- [ ] Trạng thái: Published

### ✅ Article hoàn chỉnh
- [ ] Tiêu đề + Slug
- [ ] Tóm tắt (Excerpt)
- [ ] Loại bài viết
- [ ] Danh mục + Tác giả
- [ ] Ảnh đại diện + Alt text
- [ ] Nội dung (500+ từ)
- [ ] Sản phẩm liên quan (nếu có)
- [ ] Meta Title + Description
- [ ] Trạng thái: Published

---

## Kích thước ảnh chuẩn

| Loại | Kích thước | Dung lượng |
|------|------------|------------|
| Banner/Hero | 1920x600px | < 500KB |
| OG Image | 1200x630px | < 300KB |
| Logo sản phẩm | 200x200px | < 50KB |
| Thumbnail | 400x300px | < 100KB |
| Ảnh trong bài | 800-1200px width | < 200KB |

---

## Hỗ trợ

Liên hệ khi cần trợ giúp:
- Email: support@top10.com
- Slack: #admin-support
