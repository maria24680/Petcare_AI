'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  getSession
} = authClient;

// Google OAuth Provider
export const googleProvider = {
  signIn: () => authClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  }),
};

// Email/Password Provider
export const emailPasswordProvider = {
  signIn: (email: string, password: string) =>
    authClient.signIn.email({
      email,
      password,
      callbackURL: '/dashboard',
    }),
  signUp: (email: string, password: string, name: string) =>
    authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: '/dashboard',
    }),
};

export default authClient;