import { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../stores/auth-store';
import { axiosInstance } from '../lib/api-client';

// Expo 웹 브라우저 세션 완료 처리
WebBrowser.maybeCompleteAuthSession();

// 카카오 OAuth 설정
const KAKAO_CLIENT_ID = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID || '';

const discovery = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
  tokenEndpoint: 'https://kauth.kakao.com/oauth/token',
};

export function useAuth() {
  const { isAuthenticated, isLoading, user, login, logout, checkAuth } = useAuthStore();

  // Expo Auth Session 설정
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'checkeer',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KAKAO_CLIENT_ID,
      redirectUri,
      scopes: ['profile_nickname', 'account_email'],
    },
    discovery
  );

  // 카카오 로그인 응답 처리
  useEffect(() => {
    if (response?.type === 'success') {
      handleKakaoLoginSuccess(response.params.code);
    }
  }, [response]);

  // 카카오 로그인 성공 시 서버에 토큰 전송
  const handleKakaoLoginSuccess = useCallback(async (code: string) => {
    try {
      // 1. 카카오에서 access_token 획득
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          code,
          clientId: KAKAO_CLIENT_ID,
          redirectUri,
        },
        discovery
      );

      // 2. 서버에 카카오 토큰 전송하여 자체 토큰 발급
      // TODO: 서버 API가 준비되면 실제 엔드포인트로 변경
      const serverResponse = await axiosInstance.post('/api/auth/kakao/mobile', {
        kakaoAccessToken: tokenResponse.accessToken,
      });

      // 3. 로그인 처리
      await login(
        serverResponse.data.accessToken,
        serverResponse.data.refreshToken,
        serverResponse.data.user
      );

      // 4. 홈 화면으로 이동
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      // Mock 로그인 (개발용)
      await mockLogin();
    }
  }, [login, redirectUri]);

  // Mock 로그인 (서버 API가 준비되기 전 개발용)
  const mockLogin = useCallback(async () => {
    const mockUser = {
      memberId: 1,
      memberName: '테스트 유저',
    };
    const mockToken = 'mock_access_token_' + Date.now();
    
    await login(mockToken, undefined, mockUser);
    router.replace('/');
  }, [login]);

  // 카카오 로그인 시작
  const loginWithKakao = useCallback(async () => {
    if (KAKAO_CLIENT_ID) {
      await promptAsync();
    } else {
      // 카카오 설정이 없으면 Mock 로그인
      console.warn('Kakao client ID not configured, using mock login');
      await mockLogin();
    }
  }, [promptAsync, mockLogin]);

  // 로그아웃
  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/login');
  }, [logout]);

  // 인증 가드 - 인증이 필요한 페이지에서 사용
  const requireAuth = useCallback(async () => {
    const isAuth = await checkAuth();
    if (!isAuth) {
      router.replace('/login');
      return false;
    }
    return true;
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    user,
    loginWithKakao,
    mockLogin,
    logout: handleLogout,
    requireAuth,
    checkAuth,
  };
}

