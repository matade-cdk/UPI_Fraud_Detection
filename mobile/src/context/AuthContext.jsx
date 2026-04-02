import React, { createContext, useContext, useMemo, useState } from "react";

import { fetchMe, loginUser, setAuthToken, signupUser } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function signUp(payload) {
    setLoading(true);
    const response = await signupUser(payload);

    if (!response.ok) {
      setLoading(false);
      return response;
    }

    setAuthToken(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user || null);
    setLoading(false);
    return { ok: true, user: response.user };
  }

  async function login(payload) {
    setLoading(true);
    const response = await loginUser(payload);

    if (!response.ok) {
      setLoading(false);
      return response;
    }

    setAuthToken(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user || null);
    setLoading(false);
    return { ok: true, user: response.user };
  }

  async function refreshProfile() {
    const response = await fetchMe();
    if (response.ok) {
      setUser(response.user || null);
    }
    return response;
  }

  function logout() {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      signUp,
      login,
      logout,
      refreshProfile,
      isAuthenticated: Boolean(token && user),
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
