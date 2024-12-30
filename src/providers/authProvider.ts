import {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  IdentityResponse,
  OnErrorResponse,
  PermissionResponse,
} from '@refinedev/core';

import Parse from 'parse';

export const authProvider: AuthProvider = {
  login: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      const user = await Parse.User.logIn(email, password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user.toJSON()));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error };
    }
    return undefined;
  },

  logout: async (): Promise<AuthActionResponse> => {
    try {
      await Parse.User.logOut();
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  check: async (): Promise<CheckResponse> => {
    const user = localStorage.getItem('user');
    return user
      ? { authenticated: true }
      : { authenticated: false, error: { message: "User not authenticated", name: "NotAuthenticated" } };
  },

  onError: async (error): Promise<OnErrorResponse> => {
    if (error?.status === 209) { // Invalid session token
      return { redirectTo: "/login" };
    }
    return {};
  },

  getPermissions: async (): Promise<PermissionResponse> => {
    const user = Parse.User.current();
    if (user) {
      return { permissions: user.get('role') };
    }
    return { permissions: null };
  },

  getIdentity: async (): Promise<IdentityResponse> => {
    const user = Parse.User.current();
    if (user) {
      return user;
    }
    return null;
  },
};