<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@stores/auth.store';
import { useAppToast } from '@shared/composables/useAppToast';
import EditProfileModal from '@features/auth/components/EditProfileModal.vue';
import type { UserRole } from '@core/types';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const appToast = useAppToast();

const isMenuOpen = ref(false);
const isEditProfileOpen = ref(false);

const availableRoles: { role: UserRole; label: string; icon: string }[] = [
  { role: 'ADMIN', label: 'Admin / Manager', icon: '👑' },
  { role: 'INSTRUCTOR', label: 'Instructor / Teacher', icon: '🎓' },
  { role: 'STUDENT', label: 'Learner / Student', icon: '📖' },
];

function switchRole(role: UserRole) {
  authStore.updateUserRole(role);
  appToast.success(`Switched role to ${role}`);
  isMenuOpen.value = false;
}

function handleOpenEditProfile() {
  isMenuOpen.value = false;
  isEditProfileOpen.value = true;
}

function handleLogout() {
  authStore.logout();
  appToast.info(t('auth.logout'));
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      @click="isMenuOpen = !isMenuOpen"
      class="flex items-center gap-2 text-start transition-opacity hover:opacity-90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-0.5"
      aria-haspopup="true"
      :aria-expanded="isMenuOpen"
    >
      <!-- Avatar with Border Frame -->
      <div class="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="User Avatar"
          class="size-9 rounded-full object-cover pointer-events-none"
        />
      </div>

      <!-- User Details (Figma: Saeed Kamel / Lab Manager) -->
      <div class="hidden sm:flex flex-col items-start leading-none select-none">
        <span class="font-zain font-bold text-[14px] text-foreground leading-[1.2]">
          {{ authStore.user?.name || 'Saeed Kamel' }}
        </span>
        <span class="font-zain font-light text-[12px] text-muted-foreground leading-[1.4]">
          {{ authStore.user?.role || 'ADMIN' }}
        </span>
      </div>
    </button>

    <!-- Profile Dropdown Menu -->
    <div
      v-if="isMenuOpen"
      @click.outside="isMenuOpen = false"
      class="absolute end-0 mt-2 w-56 rounded-2xl border border-border bg-card p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div class="px-3 py-2 border-b border-border text-xs">
        <p class="font-bold text-foreground m-0">{{ authStore.user?.name || 'Saeed Kamel' }}</p>
        <p class="text-muted-foreground truncate m-0">{{ authStore.user?.email || 'saeed.kamel@example.com' }}</p>
      </div>

      <!-- Edit Profile Action (Figma Modal 43:117) -->
      <button
        type="button"
        @click="handleOpenEditProfile"
        class="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer mt-1 font-medium"
      >
        <span>✏️</span>
        <span>Edit Profile / تعديل الحساب</span>
      </button>

      <!-- Live Role Switcher (RBAC Dynamic Sidebar Testing) -->
      <div class="py-1">
        <div class="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Switch User Role (RBAC)
        </div>
        <button
          v-for="r in availableRoles"
          :key="r.role"
          type="button"
          @click="switchRole(r.role)"
          :class="[
            'flex w-full items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer',
            (authStore.user?.role || 'ADMIN') === r.role
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-foreground hover:bg-muted',
          ]"
        >
          <span class="flex items-center gap-2">
            <span>{{ r.icon }}</span>
            <span>{{ r.label }}</span>
          </span>
          <span v-if="(authStore.user?.role || 'ADMIN') === r.role" class="text-primary text-xs">✓</span>
        </button>
      </div>

      <div class="my-1 border-t border-border" />

      <router-link
        :to="{ name: 'dashboard' }"
        @click="isMenuOpen = false"
        class="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"
      >
        <span>📊</span>
        <span>{{ t('nav.dashboard') }}</span>
      </router-link>

      <router-link
        :to="{ name: 'courses-list' }"
        @click="isMenuOpen = false"
        class="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"
      >
        <span>📚</span>
        <span>{{ t('nav.viewCourses') }}</span>
      </router-link>

      <div class="my-1 border-t border-border" />

      <button
        type="button"
        @click="handleLogout()"
        class="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer font-medium"
      >
        <span>🚪</span>
        <span>{{ t('auth.logout') }}</span>
      </button>
    </div>

    <!-- Edit Personal Information Modal (Figma 43:117) -->
    <EditProfileModal v-model:open="isEditProfileOpen" />
  </div>
</template>
