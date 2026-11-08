# Campus Marketplace Backend API

Backend REST API for CampusCart (ABES Engineering College Student Marketplace).

---

## 🛠️ Tech Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database ODM:** Mongoose (MongoDB)
- **Security & Utilities:** Cors, Dotenv, Morgan, JsonWebToken, BcryptJS

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd Campus-Marketplace/server
npm install
```

### 2. Environment Configuration
Verify or edit `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_marketplace
JWT_SECRET=campus_marketplace_super_secret_jwt_key_2026
JWT_EXPIRE=30d
```

### 3. Run the Server
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Run API Test Suite:**
  ```bash
  npm test
  ```

---

## 🔐 1. Authentication APIs (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register student with `@abes.ac.in` email |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `POST` | `/api/auth/logout` | Public | Terminate session / logout |
| `GET`  | `/api/auth/me` | Protected (JWT) | Retrieve authenticated profile |
| `PUT`  | `/api/auth/profile` | Protected (JWT) | Update student profile info |

---

## 📦 2. Product APIs (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | View all products (filters: `search`, `category`, `condition`, `minPrice`, `maxPrice`, `sort`, `page`) |
| `GET` | `/api/products/search?q=query` | Public | Quick keyword search across title, description & category |
| `GET` | `/api/products/:id` | Public | View single product details (increments views automatically) |
| `POST` | `/api/products` | Protected (JWT) | Add a new product listing |
| `PUT` | `/api/products/:id` | Protected (Owner/Admin) | Update product details |
| `DELETE` | `/api/products/:id` | Protected (Owner/Admin) | Delete product listing |
| `GET` | `/api/products/my/listings` | Protected (JWT) | Get all listings uploaded by logged-in user |

---

## ❤️ 3. Wishlist APIs (`/api/wishlist`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/wishlist` | Protected (JWT) | View current user's favourite wishlisted products |
| `POST` | `/api/wishlist/:productId` | Protected (JWT) | Add a product to wishlist |
| `POST` | `/api/wishlist/toggle/:productId` | Protected (JWT) | Toggle favorite status (add if missing, remove if present) |
| `DELETE` | `/api/wishlist/:productId` | Protected (JWT) | Remove a product from wishlist |

---

## 💬 4. Chat APIs (`/api/chats`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/chats` | Protected (JWT) | Get all conversation threads (as buyer or seller) |
| `GET` | `/api/chats/:chatId` | Protected (JWT) | View chat message history between buyer and seller |
| `POST` | `/api/chats/start` | Protected (JWT) | Initiate or open a chat thread for a product |
| `POST` | `/api/chats/:chatId/messages` | Protected (JWT) | Send & save message from buyer or seller |

---

## 🛡️ 5. Admin APIs (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Protected (Admin) | Dashboard statistics (total users, active products, sold, etc.) |
| `GET` | `/api/admin/users` | Protected (Admin) | View all users with filters (`search`, `role`, `status`, `department`) |
| `PUT` | `/api/admin/users/:id/status` | Protected (Admin) | Update/toggle student account status (`active` / `suspended`) |
| `PUT` | `/api/admin/users/:id/role` | Protected (Admin) | Update student role (`student` / `admin`) |
| `DELETE` | `/api/admin/users/:id` | Protected (Admin) | Delete user account and their listings |
| `GET` | `/api/admin/products` | Protected (Admin) | View all products across all statuses (`active`, `sold`, `suspended`) |
| `PUT` | `/api/admin/products/:id/status` | Protected (Admin) | Update listing status (`active`, `sold`, `suspended`, `inactive`) |
| `DELETE` | `/api/admin/products/:id` | Protected (Admin) | Force remove any product listing |

---

### Demo Accounts
- **Student 1:** `aryan.21b0101001@abes.ac.in` / `password123`
- **Student 2:** `priya.22b0201045@abes.ac.in` / `password123`
- **Admin:** `admin.council@abes.ac.in` / `admin123`
