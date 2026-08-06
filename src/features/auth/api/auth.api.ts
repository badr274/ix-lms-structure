import axios from 'axios';
import type { UserProfile } from '@stores/auth.store';

export interface DummyJsonAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * 🔑 Login User via DummyJSON API
   * POST https://dummyjson.com/auth/login
   */
  async login(payload: { email?: string; username?: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    user: UserProfile;
  }> {
    // Extract username (DummyJSON uses username like "emilys")
    const username = payload.username || (payload.email ? payload.email.split('@')[0] : 'emilys');

    const response = await axios.post<DummyJsonAuthResponse>(
      'https://dummyjson.com/auth/login',
      {
        username: username.trim(),
        password: payload.password,
        expiresInMins: 60,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = response.data;

    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: String(data.id),
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        role: 'ADMIN',
      },
    };
  },

  /**
   * 👤 Get Current Auth User
   * GET https://dummyjson.com/auth/me
   */
  async getMe(token: string): Promise<UserProfile> {
    const response = await axios.get<DummyJsonAuthResponse>(
      'https://dummyjson.com/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    return {
      id: String(data.id),
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      role: 'ADMIN',
    };
  },
};
