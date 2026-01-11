# Kayan Jewelry – Frontend (Vite + React + TypeScript)

A modern **E-commerce frontend application** for **Kayan Jewelry**, built using **Vite**, **React 19**, **TypeScript**, **Redux Toolkit**, **React Query**, and **Tailwind CSS**. The project follows a scalable folder structure suitable for large production-ready applications, including a full **Admin Dashboard** and **Customer-facing UI**.

---

## 🚀 Tech Stack

- **Vite** – Fast build tool
- **React 19** + **TypeScript**
- **Redux Toolkit** – Global state management
- **React Query (TanStack)** – Server state & caching
- **React Router DOM v7** – Routing
- **Tailwind CSS** + **Flowbite** – Styling
- **Axios** – API communication
- **Zod** – Schema validation
- **Framer Motion** – Animations
- **Recharts** – Charts & analytics

---

## 📁 Project Structure

```text
src/
│
├── assets/              # Images, icons, fonts
├── Apis/                # API services
│
├── Components/          # Shared reusable UI components
│
├── Constants/           # App-wide constants (roles, enums, configs)
│
├── Dashboard/           # Admin dashboard module
│   ├── Apis/            # Dashboard API services
│   ├── Components/      # Dashboard-specific components
│   │   ├── Charts/
│   │   ├── filter/
│   │   ├── Navbar/
│   │   └── Sidebar/
│   ├── DashboardHooks/  # Custom hooks per dashboard feature
│   ├── DashBordInterfaces/
│   ├── Pages/
│   └── Dashboard.tsx
│
├── Hooks/               # Global reusable hooks
│
├── Pages/               # Client-side pages (Home, Shop, Cart, etc.)
│
├── Shared/              # Shared layout, guards, helpers
│
├── Store/               # Redux store configuration
│   ├── Slices/
│   │   ├── AuthSlice.ts
│   │   ├── CartSlice.ts
│   │   └── WishlistSlice.ts
│   └── store.ts
│
├── Types/               # Global TypeScript types
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 📦 Package Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🔌 API Integration

- API communication is handled using **Axios**
- APIs are grouped by feature (Products, Orders, Coupons, etc.)
- Dashboard APIs are isolated under:

```text
src/Dashboard/Apis/
```

- Server state management is handled with **React Query**

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Auth state managed via **Redux Toolkit**
- Role-based routing (Admin / User)
- Protected routes handled in `Shared` module

---

## 🎨 Styling

- **Tailwind CSS v4** for utility-first styling
- **Flowbite & Flowbite-React** for UI components
- Fully responsive design

---

## 📊 Dashboard Features

- Products management
- Categories management
- Orders tracking
- Coupons system
- Reviews moderation
- Users management
- Analytics & charts

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🧪 Linting

- ESLint configured for React + TypeScript
- Hooks & refresh rules enabled

---

## 📌 Notes

- Built to integrate with **Kayan Jewelry Backend API**
- Follows clean architecture & feature-based separation
- Optimized for scalability and maintainability

---

## 👩‍💻 Author

- **Yomna Mohamed**  
Frontend & Backend Developer
- **Mostafa Amr**   
Frontend Developer
- **Marihan taha**   
Frontend Developer
---

## 📄 License

This project is private and intended for internal or commercial use.

