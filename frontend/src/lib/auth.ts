export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
  permissions?: string[];
};

export const CUSTOMER_AUTH_CHANGED_EVENT = 'graven:customer-auth-changed';

const TOKEN_KEY = 'customer_auth_token';
const USER_KEY = 'customer_auth_user';

type JwtPayload = {
  id?: string;
  role?: string;
  exp?: number;
  iat?: number;
  permissions?: string[];
};

export function getCustomerAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setCustomerAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(CUSTOMER_AUTH_CHANGED_EVENT));
}

export function clearCustomerAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(CUSTOMER_AUTH_CHANGED_EVENT));
}

export function getCustomerAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= Number(payload.exp) * 1000;
}
