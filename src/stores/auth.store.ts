import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserRole } from '@core/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  
  const savedUser = localStorage.getItem('auth_user');
  let parsedUser: UserProfile | null = null;
  if (savedUser) {
    try {
      parsedUser = JSON.parse(savedUser);
    } catch {
      parsedUser = null;
    }
  }
  
  const user = ref<UserProfile | null>(parsedUser);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  function setSession(newToken: string, newUser: UserProfile) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  return { token, user, isAuthenticated, isAdmin, setSession, logout };
});
