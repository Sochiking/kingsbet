import { Match, BetOrder, UserProfile, AdminAnalytics } from '../types';
import { INITIAL_MATCHES, INITIAL_ORDERS, INITIAL_USER, INITIAL_ANALYTICS } from '../data/mockData';

// Store token in a module variable so it can be used for requests
let authToken: string | null = null;
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('kb_token');
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('kb_token', token);
  } else {
    localStorage.removeItem('kb_token');
  }
};

const getHeaders = (baseHeaders: Record<string, string> = {}) => {
  const headers = { ...baseHeaders };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// Service helper to interact with Express backend or local memory
export const ApiService = {
  async getMatches(): Promise<Match[]> {
    try {
      const res = await fetch('/api/matches', { headers: getHeaders() });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch {
      return INITIAL_MATCHES;
    }
  },

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const res = await fetch(`/api/matches/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch {
      return INITIAL_MATCHES.find((m) => m.id === id) || null;
    }
  },

  async getUser(): Promise<UserProfile | null> {
    if (!authToken) return null;
    try {
      const res = await fetch('/api/user', { headers: getHeaders() });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async topUpDemoPoints(amount: number = 500): Promise<{ success: boolean; balance: number }> {
    try {
      const res = await fetch('/api/user/topup', {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { success: false, balance: 0 };
    }
  },

  async getOrders(statusFilter: string = 'All'): Promise<BetOrder[]> {
    if (!authToken) return [];
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch {
      return [];
    }
  },

  async placeOrder(payload: {
    matchTitle: string;
    selection: string;
    odds: number;
    stake: number;
    matchId?: string;
  }): Promise<{ success: boolean; order?: BetOrder; newBalance?: number; error?: string }> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to place bet' };
      return data;
    } catch {
      return { success: false, error: 'Network error placing bet' };
    }
  },

  async getAdminAnalytics(): Promise<{ analytics: AdminAnalytics; recentOrders: BetOrder[]; matches: Match[] }> {
    try {
      const res = await fetch('/api/admin/analytics', { headers: getHeaders() });
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch {
      return {
        analytics: INITIAL_ANALYTICS,
        recentOrders: INITIAL_ORDERS,
        matches: INITIAL_MATCHES,
      };
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; order?: BetOrder; userBalance?: number }> {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async login(email: string, password: string): Promise<{success: boolean; access_token?: string; token_type?: string; user?: UserProfile; detail?: string}> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, detail: data.detail || 'Login failed' };
      return { success: true, ...data };
    } catch {
      return { success: false, detail: 'Network error' };
    }
  },

  async register(name: string, email: string, password: string): Promise<{success: boolean; access_token?: string; token_type?: string; user?: UserProfile; detail?: string}> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, detail: data.detail || 'Registration failed' };
      return { success: true, ...data };
    } catch {
      return { success: false, detail: 'Network error' };
    }
  }
};
