# دليل المعمارية الشامل: نظام الـ Layout والصلاحيات الواقعية (RBAC) في NASAQ LMS

هذا الملف يشرح بالتفصيل الشامل كيفية عمل الـ **Layout** من أول خطوة لآخر خطوة، وكيف يعمل نظام **الصلاحيات (Permissions & RBAC)** في بيئة الإنتاج الحقيقية وربطها بالـ Backend API خطوة بخطوة.

---

# الجزء الأول: معمارية الـ Layout وكيف يعمل من أول خطوة لآخر خطوة

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                         App.vue                                          │
│  ┌───────────────────────┐  ┌───────────────────────────────┐  ┌───────────────────────┐  │
│  │   <Toaster />         │  │   <ModalHost />               │  │   <router-view />     │  │
│  │   (إشعارات Toast)    │  │   (مودالز التأكيد والنجاح برمجياً)│  └───────────┬───────────┘  │
│  └───────────────────────┘  └───────────────────────────────┘              │             │
└────────────────────────────────────────────────────────────────────────────┼─────────────┘
                                                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                      AppLayout.vue                                       │
│                                                                                          │
│  ┌────────────────────────┐  ┌────────────────────────────────────────────────────────┐  │
│  │     AppSidebar.vue     │  │                    AppHeader.vue                       │  │
│  │                        │  │  [Toggle Collapse] [Search] [Lang] [Dark/Light] [User] │  │
│  │  - Logo (NASAQ)        │  ├────────────────────────────────────────────────────────┤  │
│  │  - Main Menu (RBAC)    │  │                  Main Content Canvas                   │  │
│  │  - Active Curved Tab   │  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  - Branch Selector     │  │  │                 PageHeader.vue                   │  │  │
│  │  - 276px <-> 88px      │  │  │  Title + Description + [⊕ CTA Action Button]    │  │  │
│  │  - Mobile Drawer       │  │  ├──────────────────────────────────────────────────┤  │  │
│  │                        │  │  │               <slot /> (Page Views)              │  │  │
│  │                        │  │  │               (Tables, Forms, Cards)             │  │  │
│  └────────────────────────┘  │  └──────────────────────────────────────────────────┘  │  │
│                              └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. شجرة المكونات وتدفق العمل (Layout Step-by-Step Flow)

### الخطوة 1: الحاوية الجذرية (`App.vue`)
- **الملف:** `src/App.vue`
- تحتوي على:
  1. `<Toaster />`: نظام التنبيهات المنبثقة من `vue-sonner`.
  2. `<ModalHost />`: يستمع لأي استدعاء لـ `useModal().confirm()` أو `useModal().success()` في أي مكان في التطبيق ويقوم بعرض المودال بدون الحاجة لكتابة HTML في كل صفحة.
  3. `<router-view />`: يعرض الصفحة الحالية حسب الرابط.

---

### الخطوة 2: هيكل التخطيط الأساسي (`AppLayout.vue`)
- **الملف:** `src/shared/components/layout/AppLayout.vue`
- يوفر الهيكل الرئيسي للداشبورد ويتحكم في:
  - **حالة تصغير السايدبار (Desktop Collapse)**:
    - العرض الكامل: `276px`.
    - العرض المصغر: `88px` (تظهر الأيقونات فقط وتختفي النصوص لتوفير مساحة للعمل).
    - الحالة محفوظة تلقائياً في الـ `localStorage` عبر `ui.store.ts`.
  - **السايدبار على شاشات الموبايل (Mobile Drawer)**:
    - يظهر كـ Slide-over Drawer ينسحب من الجانب مع خلفية مظللة وبلور `bg-black/60 backdrop-blur-xs` ويغلق تلقائياً عند الضغط خارج السايدبار أو عند اختيار صفحة.
  - **دعم اتجاه الواجهة (RTL / LTR)**:
    - عند التبديل بين العربية والإنجليزية، يتم عكس موضع السايدبار والكبسولات تلقائياً.

---

### الخطوة 3: السايدبار الذكي (`AppSidebar.vue`)
- **الملف:** `src/shared/components/layout/AppSidebar.vue`
- يحتوي على:
  1. **شعار المنصة (Logo)**: يعرض الشعار الكامل أو الشعار المصغر (`IconLogoMark`) عند تصغير السايدبار.
  2. **قائمة الروابط المصرح بها**: يتم جلبها ديناميكياً من `useNavigation()` حيث تظهر فقط الروابط المسموح بها لرتبة المستخدم الحالي.
  3. **التبويب النشط مع الانحناءات الهندسية (Active Curved Tab)**:
     - **الملف:** `src/shared/components/layout/SidebarNavItem.vue`.
     - التبويب النشط يمتد من بداية السايدبار وحتى نهايته ليلتحم مع الـ Canvas الأبيض، مع انحناءات خارجية مقعرة أعلى وأسفل (`-top-6` و `-bottom-6`) لتعطي المظهر السلس الموجود في فيجما.
  4. **محدد الفرع السفلي (Branch Selector)**: في أسفل السايدبار.

---

### الخطوة 4: الهيدر الموحد (`AppHeader.vue`)
- **الملف:** `src/shared/components/layout/AppHeader.vue`
- يحتوي على:
  1. زر تصغير/تكبير السايدبار وزر القائمة للموبايل.
  2. حقل البحث السريع الكبسولي.
  3. مبدل اللغة (AR / EN).
  4. مبدل الوضع الليلي / الفاتح (Light / Dark Theme) عبر `useTheme()`.
  5. قائمة المستخدم (`UserProfile.vue`): تعرض الاسم، الرتبة، زر تعديل الملف الشخصي، مبدل الرتب السريع، وزر تسجيل الخروج.

---

### الخطوة 5: هيدر الصفحات الموحد (`PageHeader.vue`)
- **الملف:** `src/shared/components/layout/PageHeader.vue`
- هيدر موحد بدون كارت أو بوردر سفلي مطابق لفيجما (Figma Node `78:1547`):
  - العنوان: بخط `Zain:Bold 28px`.
  - الوصف: بخط `Zain:Light 14px text-muted-foreground`.
  - زر الإجراء الاختياري: زر كبسولي `rounded-[24px]` من Shadcn مع أيقونة `IconPlusCircle` مثل "Invite User" أو "Add Branch".

---

# الجزء الثاني: الصلاحيات الواقعية (Real-World RBAC & Backend Integration)

في المشاريع الحقيقية والإنتاج، لا يتم كتابة رتبة المستخدم يدوياً في الفرونت إند، بل تأتي من الـ Backend API عند تسجيل الدخول ويتم التحقق منها عبر المعمارية التالية:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               1. استجابة الباك إند الحقيقية                              │
│                               POST /api/auth/login  أو  GET /api/auth/me               │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              2. تخزين الجلسة (Pinia Auth Store)                        │
│                authStore.setSession(token, userWithRoleAndPermissions)                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌─────────────────┐              ┌──────────────────────┐             ┌─────────────────┐
│ 3. حماية المسارات│              │ 4. فلترة السايدبار   │             │ 5. الأزرار بالواجهة│
│ (Router Guards) │              │ (useNavigation.ts)   │             │ (<Can> / v-can) │
│ منع روابط URL   │              │ إخفاء روابط غير مصرحة│             │ إخفاء أزرار الحذف│
└─────────────────┘              └──────────────────────┘             └─────────────────┘
```

---

## 1. شكل الـ Backend API Response في الواقع

عند قيام المستخدم بتسجيل الدخول أو تحديث الصفحة عبر Endpoint التحقق من الجلسة:

### 🟢 طلب تسجيل الدخول: `POST /api/auth/login`
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_88291",
      "name": "Mohamed Ahmed",
      "email": "mohamed.ahmed@nasaq.sa",
      "phone": "01234567890",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
      "role": "ADMIN",
      "branchId": "1",
      "branchName": "IX Training Center",
      "permissions": [
        "dashboard:view",
        "branch:manage",
        "branch:create",
        "branch:update",
        "branch:delete",
        "role:manage",
        "user:manage",
        "learner:manage",
        "guardian:manage",
        "audit:view",
        "settings:manage",
        "course:read",
        "course:create",
        "course:update",
        "course:delete"
      ]
    }
  }
}
```

### 🔵 مثال لاستجابة حساب "معلم / مدرب" (Instructor):
```json
{
  "role": "INSTRUCTOR",
  "permissions": [
    "dashboard:view",
    "learner:manage",
    "course:read",
    "course:create",
    "course:update"
  ]
}
```

### 🟡 مثال لاستجابة حساب "طالب / متدرب" (Student):
```json
{
  "role": "STUDENT",
  "permissions": [
    "dashboard:view",
    "course:read"
  ]
}
```

---

## 2. كيف يتم استقبالها وتخزينها في الفرونت إند؟

### في الـ Auth Store (`src/stores/auth.store.ts`):
نقوم بحفظ الـ Token وبيانات المستخدم مع مصفوفة الصلاحيات:

```typescript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions?: Permission[];
  avatar?: string;
  branchId?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const user = ref<UserProfile | null>(
    JSON.parse(localStorage.getItem('auth_user') || 'null')
  );

  function setSession(newToken: string, newUser: UserProfile) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  }

  return { token, user, setSession };
});
```

---

## 3. كيف تعمل الصلاحيات ذاتياً في كافة أجزاء التطبيق؟

### أ. التحقق الديناميكي (`usePermissions.ts`):
تقوم دالة `usePermissions()` بفحص الصلاحيات القادمة من الباك إند:
1. إذا كان المستخدم يملك رتبة `ADMIN` -> يحصل على كافة الصلاحيات تلقائياً (Super Admin Bypass).
2. إذا كانت مصفوفة `user.permissions` موجودة من الباك إند -> يتم فحص وجود الصلاحية فيها مباشرة:
```typescript
const { hasPermission, hasRole } = usePermissions();

if (hasPermission(PERMISSIONS.BRANCH_DELETE)) {
  // تنفيذ الحذف
}
```

---

### ب. إخفاء أو إظهار الروابط في السايدبار تلقائياً (`navigation.config.ts`):
في ملف `navigation.config.ts`، تحدد الصلاحيات المطلوبة لكل رابط:
```typescript
{
  id: 'branches',
  to: '/branches',
  label: 'Branches',
  icon: IconBranches,
  roles: [ROLES.ADMIN],
  permissions: [PERMISSIONS.BRANCH_MANAGE],
}
```
يقوم `useNavigation()` بقراءة صلاحيات المستخدم القادمة من الباك إند، وإخفاء أي رابط غير مصرح به تلقائياً.

---

### ج. حماية الـ Routes من كتابة الـ URL يدوياً (`auth.guard.ts`):
إذا حاول مستخدم كتابة `http://localhost:5173/branches` وهو طالب لا يملك `branch:manage`، يتدخل الـ Router Guard فوراً ويمنعه ويحوله لـ:
```
/forbidden?from=/branches
```

---

### د. حماية الأزرار والعمليات داخل الشاشات (`<Can>` Component):
لحماية زر حذف الفرع أو زر الإضافة داخل الجدول:
```vue
<template>
  <!-- يظهر زر الحذف فقط لمن يملك صلاحية branch:delete -->
  <Can :permission="PERMISSIONS.BRANCH_DELETE">
    <Button variant="destructive" size="sm" @click="handleDelete(branch.id)">
      حذف الفرع
    </Button>
  </Can>
</template>
```

---

## 4. خطوات ربط الباك إند الحقيقي (Production Setup Guide)

عندما يكون الـ Backend API جاهزاً لديك، كل ما عليك فعله هو خطوتين فقط:

### الخطوة 1: تحديث ملف الـ API (`src/features/auth/api/auth.api.ts`)
```typescript
import { apiClient } from '@core/api/client';

export const authApi = {
  async login(credentials: LoginCredentials) {
    // استدعاء الباك إند الحقيقي
    const response = await apiClient.post('/auth/login', credentials);
    return {
      token: response.data.token,
      user: response.data.user, // يحتوي على role و permissions
    };
  },

  async getMe() {
    // جلب بيانات الجلسة الحالية من السيرفر
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },
};
```

### الخطوة 2: جلب الجلسة عند فتح التطبيق لأول مرة (`App.vue` أو `router/guards`)
```typescript
// في حالة وجود token يتم استدعاء authApi.getMe() لتحديث الصلاحيات
if (authStore.token && !authStore.user) {
  const latestUser = await authApi.getMe();
  authStore.user = latestUser;
}
```

---

## 🎯 ملخص المنظومة

1. **الـ Layout**: مبني كمعمارية موحدة (`AppLayout` -> `AppSidebar` -> `AppHeader` -> `PageHeader` -> `Shadcn Components`) قابلة للتكبير والتصغير وتعمل على الموبايل والدول بالكامل.
2. **الـ Permissions**: تدعم كلاً من الـ Roles العامة وصلاحيات الـ Granular Permissions القادمة من الباك إند، وتتحكم ذاتياً في (السايدبار + الـ Routes + أزرار العمليات).
