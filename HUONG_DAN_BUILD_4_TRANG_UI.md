# HƯỚNG DẪN BUILD 4 TRANG UI TĨNH
## Clone UI 100% từ top10_templates

**Mục tiêu:** Build 4 trang UI giống 100% với file HTML gốc  
**Phạm vi:** Chỉ UI tĩnh, chưa cần database, chưa cần dynamic data

---

## 🎯 MỤC TIÊU CỤ THỂ

```
INPUT:  4 thư mục trong top10_templates/
OUTPUT: 4 trang Next.js với UI giống 100% HTML gốc

Tiêu chí "100%":
- Layout giống hệt
- Colors giống hệt
- Typography giống hệt
- Spacing giống hệt
- Responsive giống hệt
- Hover effects giống hệt
```

---

## 📁 4 TEMPLATES CẦN DÙNG

| Trang | Template folder | File HTML |
|-------|----------------|-----------|
| Homepage | `01_homepage/` | `index.html` |
| Category Listing | `02_category_tv-services/` | `index.html` |
| Product Review | `04_review_sling-tv/` | `index.html` |
| Article Detail | `10_article_gay-dating-sites/` | `index.html` |

---

## 🔴 NGUYÊN TẮC BẮT BUỘC

### 1. CSS LẤY TỪ FILE GỐC - KHÔNG ĐOÁN

```
Trong mỗi file index.html có sẵn CSS trong <style> tags:

<style data-emotion="ni ...">
.ni-abc123 {
  display: flex;
  padding: 16px;
  background: #ffffff;
  /* ... */
}
</style>

→ COPY CHÍNH XÁC các CSS rules này
→ KHÔNG được tự nghĩ ra giá trị
```

### 2. DATA DÙNG STATIC/HARDCODE TẠM THỜI

```
Vì chưa có database, hardcode data trực tiếp trong component:

// Ví dụ
const products = [
  { name: "Sling TV", score: 9.5, rank: 1 },
  { name: "YouTube TV", score: 9.3, rank: 2 },
  // ... copy từ HTML gốc
];
```

### 3. LÀM TỪNG TRANG MỘT

```
Thứ tự:
1. Homepage → Verify xong → 
2. Category Listing → Verify xong → 
3. Product Review → Verify xong → 
4. Article Detail → Done
```

---

## 📋 QUY TRÌNH CHO MỖI TRANG

### BƯỚC 1: Phân tích HTML gốc

```
1. Mở file index.html trong browser
2. Xác định các sections/components
3. Ghi chú lại structure
```

### BƯỚC 2: Extract CSS

```
1. Mở file index.html trong text editor
2. Tìm tất cả <style> tags
3. Copy toàn bộ CSS content
4. Lưu vào file riêng (vd: homepage.css)
```

### BƯỚC 3: Tạo class mapping

```
Minified class → Semantic name

ni-abc123 → header-wrapper
ni-def456 → hero-section
ni-ghi789 → product-card
...
```

### BƯỚC 4: Build React component

```
1. Copy HTML structure từ gốc
2. Convert sang JSX
3. Thay class names bằng semantic names
4. Import CSS đã extract
```

### BƯỚC 5: Verify

```
1. Mở trang gốc (HTML file) và trang clone cạnh nhau
2. So sánh visual
3. Check responsive (375px, 768px, 1440px)
4. Check hover effects
5. Sửa nếu có khác biệt
```

---

## 📄 CHI TIẾT TỪNG TRANG

---

## TRANG 1: HOMEPAGE

### Template: `01_homepage/index.html`

### Sections cần build:

```
1. Header (shared - dùng lại cho tất cả trang)
   ├── Logo
   ├── Navigation với mega menu
   └── Mobile menu

2. Hero Section
   ├── Title
   ├── Description
   └── Category cards (5 cards)

3. Brand Logos Section
   └── Logo images row

4. Trending List Section
   ├── Section title
   └── Trending cards grid

5. Stats Section
   └── 3 stat items (500+, 5000+, 16M+)

6. Experts Section
   └── Expert cards

7. Mission Section
   ├── Mission card
   └── Method card

8. More Articles Section
   └── Article cards grid

9. Explore Categories Section
   ├── Tabs
   └── Category links grid

10. Footer (shared - dùng lại cho tất cả trang)
    ├── Links
    ├── Social
    └── Copyright
```

### Output files:

```
components/
├── layout/
│   ├── Header.tsx
│   ├── Header.css
│   ├── Footer.tsx
│   └── Footer.css
├── home/
│   ├── HeroSection.tsx
│   ├── BrandLogos.tsx
│   ├── TrendingList.tsx
│   ├── StatsSection.tsx
│   ├── ExpertsSection.tsx
│   ├── MissionSection.tsx
│   ├── MoreArticles.tsx
│   ├── ExploreCategories.tsx
│   └── home.css (hoặc tách nhỏ)

app/
└── page.tsx (import các components trên)
```

### Checklist verify:

```
☐ Header hiển thị đúng (logo, nav items)
☐ Mega menu dropdown hoạt động
☐ Mobile menu hoạt động (≤768px)
☐ Hero section layout đúng
☐ Category cards 5 cột (desktop), responsive mobile
☐ Trending cards grid đúng
☐ Stats section 3 items
☐ Footer links đầy đủ
☐ Responsive 375px match
☐ Responsive 768px match
☐ Responsive 1440px match
```

---

## TRANG 2: CATEGORY LISTING

### Template: `02_category_tv-services/index.html`

### Sections cần build:

```
1. Header (đã có từ Homepage)

2. Breadcrumb
   └── Home > TV Services

3. Category Header
   ├── Title (H1)
   ├── Author info (avatar, name, date)
   └── Hero image (optional)

4. Intro Section
   └── Description text

5. Quick Top List (sidebar hoặc sticky)
   └── 1-10 quick links

6. Product Cards (⭐ QUAN TRỌNG NHẤT)
   └── ProductCard × 10
       ├── Rank badge (#1, #2, #3...)
       ├── Product logo
       ├── Product name
       ├── Tagline
       ├── Score badge (9.5 Excellent)
       ├── Highlights list (bullet points)
       ├── CTA button
       ├── Price info
       └── Editor's Choice badge (nếu có)

7. Comparison Table
   ├── Sticky header row
   └── Feature rows

8. Closer Look Section
   └── Detailed product reviews

9. FAQ Section
   └── Accordion items

10. Methodology Section

11. Related Articles Section

12. Footer (đã có)
```

### Output files:

```
components/
├── shared/
│   └── Breadcrumb.tsx
├── category/
│   ├── CategoryHeader.tsx
│   ├── QuickTopList.tsx
│   ├── ProductCard.tsx      ⭐ Component quan trọng nhất
│   ├── ProductCard.css
│   ├── ComparisonTable.tsx
│   ├── CloserLook.tsx
│   ├── FAQSection.tsx
│   ├── Methodology.tsx
│   └── RelatedArticles.tsx

app/
└── [category]/
    └── page.tsx
```

### ⭐ ProductCard - Chi tiết cần chú ý:

```
ProductCard phải có đúng các elements:

┌─────────────────────────────────────────────┐
│ #1 [RANK BADGE]                             │
│                                             │
│ [LOGO]  Product Name                        │
│         Tagline here            [9.5]       │
│                                 Excellent   │
│                                             │
│ ✓ Highlight 1                               │
│ ✓ Highlight 2                               │
│ ✓ Highlight 3                               │
│                                             │
│ Starting at $XX/mo                          │
│                                             │
│         [Visit Site Button]                 │
│                                             │
│ [Editor's Choice Badge - nếu có]            │
└─────────────────────────────────────────────┘

Lưu ý:
- Rank badge có màu khác nhau (#1 gold, #2 silver, #3 bronze?)
- Score badge có màu theo level (Excellent=green, Good=blue...)
- Hover effect trên card
- Hover effect trên button
```

### Checklist verify:

```
☐ Breadcrumb hiển thị đúng
☐ Category header đúng layout
☐ Product cards × 10 hiển thị đúng
☐ Rank badges đúng màu
☐ Score badges đúng màu và label
☐ CTA buttons hover effect
☐ Comparison table scroll horizontal (mobile)
☐ FAQ accordion expand/collapse
☐ Responsive match
```

---

## TRANG 3: PRODUCT REVIEW

### Template: `04_review_sling-tv/index.html`

### Sections cần build:

```
1. Header (đã có)

2. Breadcrumb
   └── Home > TV Services > Reviews > Sling TV

3. Review Header
   ├── Product logo (large)
   ├── Product name
   ├── Large score display (circle/badge)
   ├── Score label (Excellent)
   ├── Quick stats
   └── Main CTA button

4. Pros & Cons Section
   ├── Pros column (green checks)
   └── Cons column (red X)

5. Pricing Section
   ├── Toggle (Monthly/Annual)
   └── Plan cards × n

6. Full Review Content
   ├── H2 sections
   ├── Paragraphs
   ├── Lists
   ├── Images
   └── (Table of Contents sidebar?)

7. User Reviews Section
   ├── Rating summary (average, distribution)
   └── Review cards

8. Related Products Section

9. Footer (đã có)
```

### Output files:

```
components/
├── product/
│   ├── ReviewHeader.tsx
│   ├── ProsCons.tsx
│   ├── PricingSection.tsx
│   ├── FullReview.tsx
│   ├── UserReviews.tsx
│   ├── RelatedProducts.tsx
│   └── product.css

app/
└── [category]/
    └── reviews/
        └── [product]/
            └── page.tsx
```

### Checklist verify:

```
☐ Review header layout đúng
☐ Large score badge hiển thị đúng
☐ Pros/Cons two-column layout
☐ Pros có green check icon
☐ Cons có red X icon
☐ Pricing cards layout
☐ Full review typography đúng
☐ User reviews cards
☐ Responsive match
```

---

## TRANG 4: ARTICLE DETAIL

### Template: `10_article_gay-dating-sites/index.html`

### Sections cần build:

```
1. Header (đã có)

2. Breadcrumb
   └── Home > Dating > Best Gay Dating Sites

3. Article Header
   ├── Title (H1)
   ├── Author info
   │   ├── Avatar
   │   ├── Name
   │   └── Title/Role
   ├── Published date
   └── Featured image

4. Article Content
   ├── Rich text content
   │   ├── H2, H3 headings
   │   ├── Paragraphs
   │   ├── Bullet lists
   │   ├── Numbered lists
   │   ├── Blockquotes
   │   ├── Images
   │   └── Tables (nếu có)
   └── (Table of Contents sidebar?)

5. Author Box
   ├── Large avatar
   ├── Name
   ├── Title
   ├── Bio
   └── Social links (nếu có)

6. Related Articles Section

7. Footer (đã có)
```

### Output files:

```
components/
├── article/
│   ├── ArticleHeader.tsx
│   ├── ArticleContent.tsx
│   ├── AuthorBox.tsx
│   ├── RelatedArticles.tsx
│   └── article.css

app/
└── [category]/
    └── [article]/
        └── page.tsx
```

### Checklist verify:

```
☐ Article header layout đúng
☐ Author info hiển thị đúng
☐ Featured image đúng size/ratio
☐ Article content typography đúng (H2, H3, p, ul, ol)
☐ Blockquote styling (nếu có)
☐ Author box layout
☐ Related articles cards
☐ Responsive match
```

---

## 🗂️ CẤU TRÚC PROJECT CUỐI CÙNG

```
top10-clone/
├── app/
│   ├── page.tsx                           # Homepage
│   ├── [category]/
│   │   ├── page.tsx                       # Category Listing
│   │   └── reviews/
│   │       └── [product]/
│   │           └── page.tsx               # Product Review
│   └── [category]/
│       └── [article]/
│           └── page.tsx                   # Article Detail
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Header.css
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   ├── shared/
│   │   └── Breadcrumb.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ... (other sections)
│   │   └── home.css
│   ├── category/
│   │   ├── ProductCard.tsx               ⭐
│   │   ├── ... (other components)
│   │   └── category.css
│   ├── product/
│   │   ├── ReviewHeader.tsx
│   │   ├── ... (other components)
│   │   └── product.css
│   └── article/
│       ├── ArticleHeader.tsx
│       ├── ... (other components)
│       └── article.css
│
├── styles/
│   └── extracted/                        # CSS extracted từ templates
│       ├── 01_homepage.css
│       ├── 02_category.css
│       ├── 04_product-review.css
│       └── 10_article.css
│
├── data/                                 # Static data tạm thời
│   ├── homepage.ts
│   ├── categories.ts
│   ├── products.ts
│   └── articles.ts
│
└── top10_templates/                      # Templates gốc (để reference)
    ├── 01_homepage/
    ├── 02_category_tv-services/
    ├── 04_review_sling-tv/
    └── 10_article_gay-dating-sites/
```

---

## ⏱️ THỨ TỰ THỰC HIỆN

```
PHASE 1: Setup + Shared Components
├── Setup Next.js project
├── Build Header component
├── Build Footer component
├── Build Breadcrumb component
└── ⏱️ ~2-3 giờ

PHASE 2: Homepage
├── Build tất cả sections
├── Verify với template
└── ⏱️ ~4-6 giờ

PHASE 3: Category Listing
├── Build ProductCard (quan trọng nhất!)
├── Build other sections
├── Verify với template
└── ⏱️ ~6-8 giờ

PHASE 4: Product Review
├── Build all sections
├── Verify với template
└── ⏱️ ~4-6 giờ

PHASE 5: Article Detail
├── Build all sections
├── Verify với template
└── ⏱️ ~3-4 giờ

TỔNG: ~20-27 giờ làm việc
```

---

## ✅ CHECKLIST TỔNG HỢP

```
SHARED COMPONENTS:
☐ Header + mega menu + mobile menu
☐ Footer
☐ Breadcrumb

HOMEPAGE:
☐ Hero Section
☐ Brand Logos
☐ Trending List
☐ Stats Section
☐ Experts Section
☐ Mission Section
☐ More Articles
☐ Explore Categories
☐ Responsive verified

CATEGORY LISTING:
☐ Category Header
☐ Quick Top List
☐ Product Cards × 10 ⭐
☐ Comparison Table
☐ Closer Look
☐ FAQ Accordion
☐ Methodology
☐ Related Articles
☐ Responsive verified

PRODUCT REVIEW:
☐ Review Header + large score
☐ Pros/Cons
☐ Pricing Section
☐ Full Review Content
☐ User Reviews
☐ Related Products
☐ Responsive verified

ARTICLE DETAIL:
☐ Article Header
☐ Article Content (rich text)
☐ Author Box
☐ Related Articles
☐ Responsive verified
```

---

## 📝 LƯU Ý CUỐI

```
1. CSS lấy từ <style> tags trong HTML gốc - KHÔNG ĐOÁN
2. Data hardcode tạm thời - copy từ HTML gốc
3. Làm xong 1 trang → verify → mới sang trang tiếp
4. So sánh visual với HTML gốc ở 3 breakpoints (375, 768, 1440)
5. Nếu có khác biệt → check lại CSS đã extract đúng chưa
```

---

**Gửi file này + 4 thư mục templates cho Claude Code để bắt đầu build UI.**
