# CampusCart - ABES Engineering College Student Marketplace

CampusCart is a peer-to-peer marketplace tailored exclusively for ABES Engineering College students to buy, sell, and pass down textbooks, mini-drafters, hostel supplies, bicycles, and electronics.

---

## 🚀 Quick Start (Running Frontend)

Navigate to the `client` directory and start the Vite dev server:

```bash
cd client
npm install
npm run dev
```

The application will be live at: **`http://localhost:3000`**

To create a production build:
```bash
npm run build
```

---

## 🌟 Implemented Features

### 1. Home Page
- **Navbar & Logo**: CampusCart ABES branding, global search bar, wishlist counter badge, chat notification indicator, and user profile menu.
- **Hero Section**: High-conversion hero banner with college metrics, quick CTAs ("Browse Store" & "Sell an Item").
- **Interactive Search Bar**: Search input with instant ABES keyword chips (e.g., Mini Drafter, Casio FX-991, Room Cooler).
- **Categories**: 8 engineering-focused categories (Books, Electronics, Hostel Essentials, Lab & Engineering Kits, Cycles, Stationery & Drafters, College Uniforms, Sports).
- **Featured Products**: Highlighted student deals with discount tags.
- **Recently Added Products**: Real-time sorted items recently listed by students.
- **Campus Safety Footer**: Physical pickup rules, college address, and official links.

### 2. Login & Register
- **Strict `@abes.ac.in` Email Validation**: Real-time frontend validation blocking any email not ending with `@abes.ac.in` with visual feedback alerts.
- **Student Registration Details**: Name, College Email, Branch / Department, Year / Semester, Roll Number, Phone, and Hostel.
- **Quick Demo Account Fillers**: One-click demo login buttons for student & admin evaluation.
- **Password Security**: Password strength requirements and show/hide visibility toggles.

### 3. Products Catalog Page
- **Full Catalog Grid**: Responsive card grid of all campus items.
- **Search Filtering**: Live query search across title, description, and pickup location.
- **Multi-Filter Sidebar**:
  - Category selector with live listing counts
  - Budget range slider (₹100 to ₹10,000)
  - Condition filters (*Brand New*, *Like New*, *Good*, *Fair*)
- **Sorting Options**: Sort by Recently Listed, Price (Low to High), Price (High to Low), or Featured First.

### 4. Product Detail Page
- **Image Gallery**: Large hero product image with selectable thumbnails.
- **Pricing & Discounts**: Strikethrough retail MRP and instant savings calculator.
- **Item Specs**: Condition badge, detailed description, and pickup location.
- **Verified Seller Card**: Senior / student info, department, year, hostel location, and peer trust rating.
- **Direct Actions**:
  - **Contact Seller**: Instantly launches an interactive peer chat
  - **Call / WhatsApp**: Quick direct modal
  - **Wishlist Toggle**: Heart button with instant feedback

### 5. Add Product & My Listings
- **Add Product Form**: Title, category, price, MRP, condition, campus pickup point, and description.
- **Live Image Previews**: URL input with instant thumbnail cards, cover badge, and remove controls, plus 1-click sample presets.
- **My Listings**:
  - Active vs. Sold out status toggle
  - In-place Edit Listing UI
  - Delete listing with confirmation dialog
  - Inventory worth and inquiries/views metrics

### 6. Wishlist & Profile
- **Wishlist**: Dedicated saved items dashboard with empty-state guide.
- **Student Profile**: Academic records (Branch, Year, Roll Number, Phone, Hostel).
- **Edit Profile Modal**: Instant edit form updating user details with LocalStorage persistence.

### 7. Chat & Admin Dashboard
- **Buyer-Seller Chat**:
  - Conversation list with active selection and unread badges
  - Real-time message thread with timestamps
  - Quick campus negotiation pills (*"Is this still available?"*, *"Can we meet at Canteen?"*, etc.)
  - Simulated seller auto-responses for realistic demo feel
- **Admin Moderation Dashboard**:
  - KPI statistics (Total listings, total market circulation, verified student count)
  - **Product Management Table**: Review items, Approve, Flag/Suspend, or Delete listings
  - **User Management Table**: View verified accounts, toggle student status (*Active* / *Suspended*), and toggle Role (*Student* / *Admin*)

---

## 📁 Project Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CategoryCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── SearchBar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── MarketplaceContext.jsx
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── AddProduct.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Chat.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyListings.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Wishlist.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
