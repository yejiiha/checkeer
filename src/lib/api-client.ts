import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// API 기본 URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.checkmy.run';

// 토큰 저장 키
export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// 플랫폼별 스토리지 유틸리티 (웹에서는 SecureStore가 지원되지 않음)
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      // SecureStore 실패 시 AsyncStorage로 폴백
      return AsyncStorage.getItem(key);
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // SecureStore 실패 시 AsyncStorage로 폴백
      await AsyncStorage.setItem(key, value);
    }
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // SecureStore 실패 시 AsyncStorage로 폴백
      await AsyncStorage.removeItem(key);
    }
  },
};

// Axios 인스턴스 생성
export const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 자동 첨부
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      // 토큰 만료 시 토큰 삭제 및 로그인 페이지로 이동
      try {
        await storage.deleteItem(TOKEN_KEY);
        await storage.deleteItem(REFRESH_TOKEN_KEY);
      } catch (e) {
        console.warn('Failed to delete tokens:', e);
      }
      
      // 로그인 페이지로 리다이렉트
      router.replace('/login');
    }

    return Promise.reject(error);
  }
);

// Orval용 커스텀 인스턴스
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore - Orval에서 사용하는 cancel 메서드
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// 토큰 관리 유틸리티
export const tokenUtils = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await storage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await storage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  async clearTokens(): Promise<void> {
    await storage.deleteItem(TOKEN_KEY);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  },
};

export default customInstance;


