import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, withAuthHeader } from "../api/client";

const AuthContext = createContext(null);

const SESSION_KEY = "stock_management_session";
const REMEMBER_KEY = "stock_management_remember";

function readStorage(key, storage) {
  try {
    const value = storage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Failed to read authentication storage: ${key}`, error);
    storage.removeItem(key);
    return null;
  }
}

function getStoredSession() {
  const sessionUser = readStorage(SESSION_KEY, sessionStorage);
  if (sessionUser) {
    return sessionUser;
  }

  const rememberedUser = readStorage(REMEMBER_KEY, localStorage);
  if (rememberedUser) {
    return rememberedUser;
  }

  return null;
}

function saveSession(user, token, remember) {
  const session = { user, token };

  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  if (remember) {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

function getToken() {
  const session = readStorage(SESSION_KEY, sessionStorage) || readStorage(REMEMBER_KEY, localStorage);
  return session?.token || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const storedSession = getStoredSession();

      if (!storedSession?.token) {
        if (mounted) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const result = await apiRequest("/auth/me", {
          headers: withAuthHeader(storedSession.token),
        });

        if (!mounted) {
          return;
        }

        const currentUser = result?.data?.user ?? result?.user ?? result?.data;
        if (!currentUser) {
          throw new Error("Invalid authentication response.");
        }

        saveSession(currentUser, storedSession.token, Boolean(readStorage(REMEMBER_KEY, localStorage)));
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication session could not be restored.", error);
        clearSession();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const isAuthenticated = Boolean(user);

  const login = useCallback(async (username, password, remember = false) => {
    try {
      setLoginLoading(true);

      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          username: username.trim().toLowerCase(),
          password,
          remember,
        },
      });

      const data = result?.data ?? result;
      if (!data?.token || !data?.user) {
        return {
          success: false,
          message: "The server returned an invalid login response.",
        };
      }

      saveSession(data.user, data.token, remember);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to sign in.",
      };
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const result = await apiRequest("/auth/signup", {
        method: "POST",
        body: {
          fullName: data.fullName.trim(),
          username: data.username.trim().toLowerCase(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || "",
          password: data.password,
          department: data.department?.trim() || "",
        },
      });

      const createdUser = result?.data?.user ?? result?.user ?? result?.data;
      if (!createdUser) {
        return {
          success: false,
          message: "The server did not return the created user.",
        };
      }

      return { success: true, user: createdUser };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to create the account.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const token = getToken();

    try {
      if (token) {
        await apiRequest("/auth/logout", {
          method: "POST",
          headers: withAuthHeader(token),
        });
      }
    } catch (error) {
      console.error("Backend logout failed.", error);
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const localLogout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) {
      return false;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (
      user.roles?.some((role) => allowedRoles.includes(role)) ||
      allowedRoles.includes(user.role)
    );
  }, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user || !permission) {
      return false;
    }

    if (user.permissions?.includes("*")) {
      return true;
    }

    return Boolean(user.permissions?.includes(permission));
  }, [user]);

  const hasAnyPermission = useCallback((permissions = []) => {
    if (!user) {
      return false;
    }

    if (user.permissions?.includes("*")) {
      return true;
    }

    return permissions.some((permission) => user.permissions?.includes(permission));
  }, [user]);

  const hasAllPermissions = useCallback((permissions = []) => {
    if (!user) {
      return false;
    }

    if (user.permissions?.includes("*")) {
      return true;
    }

    return permissions.every((permission) => user.permissions?.includes(permission));
  }, [user]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    const token = getToken();
    if (token) {
      saveSession(updatedUser, token, Boolean(readStorage(REMEMBER_KEY, localStorage)));
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    register,
    logout,
    localLogout,
    authLoading,
    loginLoading,
    setLoginLoading,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    updateUser,
  }), [user, isAuthenticated, login, register, logout, localLogout, authLoading, loginLoading, hasRole, hasPermission, hasAnyPermission, hasAllPermissions, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
