# KẾ HOẠCH BACKEND VỚI MONGODB

## THÔNG TIN XÁC NHẬN
- **Database**: MongoDB
- **Authentication**: Password cứng (admin123)
- **Role**: Chỉ 1 Admin role

---

## 1. CÔNG NGHỆ SỬ DỤNG

| Thành phần | Công nghệ |
|------------|-----------|
| Database | MongoDB (Atlas hoặc local) |
| ORM | Prisma với MongoDB adapter |
| Auth | JWT + bcryptjs |
| API | Next.js API Routes |

---

## 2. CẤU TRÚC THƯ MỤC

```
top10-next/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/route.ts        # POST - Login
│   │   ├── categories/
│   │   │   ├── route.ts              # GET, POST
│   │   │   └── [id]/route.ts         # GET, PUT, DELETE
│   │   └── products/
│   │       ├── route.ts              # GET, POST
│   │       └── [id]/route.ts         # GET, PUT, DELETE
│   ├── admin/page.tsx                # Sửa: gọi API
│   └── page.tsx                      # Sửa: fetch API
│
├── lib/
│   ├── db.ts                         # Prisma client
│   └── auth.ts                       # JWT helpers
│
├── prisma/
│   ├── schema.prisma                 # MongoDB schema
│   └── seed.ts                       # Import data ban đầu
│
└── .env                              # MONGODB_URI, JWT_SECRET
```

---

## 3. DATABASE SCHEMA (MongoDB + Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
}

model Admin {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Category {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  slug      String    @unique
  name      String
  icon      String
  color     String    @default("bg-white")
  featured  Boolean   @default(false)
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  rank                Int
  title               String
  description         String
  detailedDescription String?
  image               String
  rating              Float?
  price               String?
  features            String[]
  pros                String[]
  cons                String[]
  affiliateLink       String
  featured            Boolean  @default(false)

  categoryId          String   @db.ObjectId
  category            Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

---

## 4. API ENDPOINTS

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/login` | `{username, password}` | `{token, user}` |

### Categories
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/categories` | - | `Category[]` |
| POST | `/api/categories` | `{slug, name, icon, featured}` | `Category` |
| GET | `/api/categories/[id]` | - | `Category` |
| PUT | `/api/categories/[id]` | `{name, icon, featured}` | `Category` |
| DELETE | `/api/categories/[id]` | - | `{success: true}` |

### Products
| Method | Endpoint | Query/Body | Response |
|--------|----------|------------|----------|
| GET | `/api/products?categoryId=xxx` | - | `Product[]` |
| POST | `/api/products` | `{...productData}` | `Product` |
| GET | `/api/products/[id]` | - | `Product` |
| PUT | `/api/products/[id]` | `{...productData}` | `Product` |
| DELETE | `/api/products/[id]` | - | `{success: true}` |

---

## 5. DEPENDENCIES CẦN CÀI

```bash
npm install @prisma/client bcryptjs jsonwebtoken
npm install -D prisma @types/bcryptjs @types/jsonwebtoken
```

---

## 6. ENVIRONMENT VARIABLES

```env
# .env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/top10rating?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-here"
```

---

## 7. CÁC PHASE TRIỂN KHAI

### Phase 1: Setup Database & Prisma
- [ ] Cài dependencies
- [ ] Tạo prisma/schema.prisma
- [ ] Setup MongoDB connection
- [ ] Chạy prisma generate
- [ ] Tạo seed script

### Phase 2: Tạo API Routes
- [ ] POST /api/auth/login
- [ ] GET/POST /api/categories
- [ ] GET/PUT/DELETE /api/categories/[id]
- [ ] GET/POST /api/products
- [ ] GET/PUT/DELETE /api/products/[id]

### Phase 3: Sửa Admin Components
- [ ] app/admin/page.tsx - Login gọi API
- [ ] Top10Manager.tsx - CRUD gọi API
- [ ] CategoryButtonManager.tsx - CRUD gọi API

### Phase 4: Sửa Frontend Components
- [ ] HomeClient.tsx - Fetch từ API
- [ ] CategoryPills.tsx - Fetch từ API
- [ ] Header.tsx - Fetch featured categories

### Phase 5: Testing & Cleanup
- [ ] Test APIs với Postman/curl
- [ ] Test Admin CRUD
- [ ] Test FE display
- [ ] Xóa code localStorage cũ
- [ ] Commit & Push

---

## 8. FILES CẦN TẠO MỚI (11 files)

1. `prisma/schema.prisma`
2. `lib/db.ts`
3. `lib/auth.ts`
4. `app/api/auth/login/route.ts`
5. `app/api/categories/route.ts`
6. `app/api/categories/[id]/route.ts`
7. `app/api/products/route.ts`
8. `app/api/products/[id]/route.ts`
9. `prisma/seed.ts`
10. `.env.example`
11. Cập nhật `package.json`

## 9. FILES CẦN SỬA (6 files)

1. `app/admin/page.tsx`
2. `components/admin/Top10Manager.tsx`
3. `components/admin/CategoryButtonManager.tsx`
4. `components/HomeClient.tsx`
5. `components/CategoryPills.tsx`
6. `components/Header.tsx`

---

## 10. LƯU Ý MONGODB

- Cần tạo MongoDB Atlas cluster (free tier OK)
- Hoặc chạy MongoDB local với Docker
- Prisma với MongoDB cần replica set (Atlas đã có sẵn)

---

**Tổng: 17 files cần tạo/sửa**
