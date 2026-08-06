# 🚀 IX LMS Dashboard Platform

A state-of-the-art, feature-based **Learning Management System (LMS) Dashboard** built with **Vue 3**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Shadcn Vue**, **Pinia**, **Vue Router**, **Vue Query**, and **vue-i18n**.

---

## 🏗️ Architecture & Project Structure

The project follows a scalable, modular **Feature-Based & Clean Architecture**:

```
src/
├── core/                   # Infrastructure & Centralized Systems
│   ├── api/                # Axios instance, Interceptors & Error Handlers
│   ├── i18n/               # Vue-i18n setup with JSON dictionaries (ar.json & en.json)
│   ├── permissions/        # RBAC System (PERMISSIONS, ROLES, usePermissions & <Can> component)
│   ├── query/              # Vue Query Client & Query Keys registry
│   ├── types/              # Global domain types
│   └── validation/         # Centralized Zod rules (rules.ts) with dynamic i18n
├── shared/                 # Reusable Application Elements
│   ├── components/
│   │   ├── buttons/        # Unified AppButton with automatic loading state
│   │   ├── inputs/         # Expressive form inputs (FormInput, FormSelect, FormTextarea, FormFileInput)
│   │   └── ui/             # Vector AppSpinner component
│   └── composables/        # useAppToast (vue-sonner integration)
├── features/               # Business Domains & Pages
│   ├── auth/               # Register & Login forms, schemas, views, and APIs
│   └── courses/            # Course creation, list management, and Vue Query hooks
├── stores/                 # State Management (Pinia: auth, locale, theme)
└── router/                 # Vue Router configuration & Auth Guards
```

---

## ✨ Key Features & Technical Highlights

### 1. 🔐 Authentication & Real API Integration
* Connected to **DummyJSON Real Auth API** (`https://dummyjson.com/auth/login` and `/auth/me`).
* **Smart Route Guards**: Protects private routes (`meta.requiresAuth`) and redirects unauthenticated users to `/login?redirect=...`.
* **Guest Route Restrictions**: Automatically redirects logged-in users away from `/login` or `/register` to `/dashboard`.

### 2. 🛡️ Role-Based Access Control (RBAC)
* Strongly-typed `PERMISSIONS` and `ROLES` constants (`PERMISSIONS.COURSE_CREATE`, `PERMISSIONS.COURSE_DELETE`).
* Declarative `<Can>` template wrapper for clean permission checks:
  ```html
  <Can :permission="PERMISSIONS.COURSE_CREATE">
    <AppButton>Add Course</AppButton>
  </Can>
  ```

### 3. 🌐 Dynamic i18n Localization
* Structured `ar.json` and `en.json` translation files.
* **Dynamic Parameter Interpolation**: Error messages accept dynamic constraints like `{min}`, `{max}`, `{length}`, and `{maxSize}`.
* Dynamic HTML direction (`rtl` / `ltr`) switching synchronized with Pinia store.

### 4. 🎨 Design & UI Excellence
* Built with official **Shadcn Vue** primitives (`Button`, `Card`, `Badge`, `Tabs`, `Select`, `Input`, `Label`).
* OKLCH CSS variables for seamless **Light & Dark mode** switching.
* Global **`AppButton`** and **`AppSpinner`** components for clean, uniform action states.
* Ready-made **`vue-sonner`** notifications with rich colors and dark mode support.

---

## 🛠️ Scripts & Commands

### Development
```bash
npm run dev
```

### Type Checking & Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
