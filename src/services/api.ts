import {
  Match,
  BetOrder,
  UserProfile,
  AdminAnalytics,
} from '../types';

import {
  INITIAL_MATCHES,
  INITIAL_ORDERS,
  INITIAL_USER,
  INITIAL_ANALYTICS,
} from '../data/mockData';

/**
 * Authentication token
 */
let authToken: string | null = null;

/**
 * Load saved token safely.
 * This prevents errors when running in SSR/build environments
 * where window/localStorage may not exist.
 */
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('kb_token');
}

/**
 * Set or clear authentication token.
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;

  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('kb_token', token);
    } else {
      localStorage.removeItem('kb_token');
    }
  }
};

/**
 * Get current authentication token.
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Build request headers.
 */
const getHeaders = (
  baseHeaders: Record<string, string> = {}
): Record<string, string> => {
  const headers: Record<string, string> = {
    ...baseHeaders,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Safely parse JSON responses.
 */
const parseJson = async <T>(res: Response): Promise<T | null> => {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

/**
 * Handle unauthorized responses.
 */
const handleUnauthorized = (res: Response): void => {
  if (res.status === 401) {
    setAuthToken(null);
  }
};

/**
 * API Service
 */
export const ApiService = {
  /**
   * Get all matches.
   */
  async getMatches(): Promise<Match[]> {
    try {
      const res = await fetch('/api/matches', {
        method: 'GET',
        headers: getHeaders(),
      });

      handleUnauthorized(res);

      if (!res.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await parseJson<Match[]>(res);

      if (!data) {
        throw new Error('Invalid matches response');
      }

      return data;
    } catch {
      // Fallback to mock data when backend is unavailable.
      return INITIAL_MATCHES;
    }
  },

  /**
   * Get a single match by ID.
   */
  async getMatchById(id: string): Promise<Match | null> {
    try {
      const encodedId = encodeURIComponent(id);

      const res = await fetch(`/api/matches/${encodedId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      handleUnauthorized(res);

      if (!res.ok) {
        throw new Error('Failed to fetch match');
      }

      const data = await parseJson<Match>(res);

      if (!data) {
        throw new Error('Invalid match response');
      }

      return data;
    } catch {
      return INITIAL_MATCHES.find((match) => match.id === id) || null;
    }
  },

  /**
   * Get currently authenticated user.
   */
  async getUser(): Promise<UserProfile | null> {
    if (!authToken) {
      return null;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'GET',
        headers: getHeaders(),
      });

      handleUnauthorized(res);

      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await parseJson<UserProfile>(res);

      if (!data) {
        throw new Error('Invalid user response');
      }

      return data;
    } catch {
      return null;
    }
  },

  /**
   * Demo top-up.
   */
  async topUpDemoPoints(
    amount: number = 500
  ): Promise<{ success: boolean; balance: number; error?: string }> {
    if (!authToken) {
      return {
        success: false,
        balance: 0,
        error: 'You must be logged in',
      };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        balance: 0,
        error: 'Invalid top-up amount',
      };
    }

    try {
      const res = await fetch('/api/user/topup', {
        method: 'POST',
        headers: getHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ amount }),
      });

      handleUnauthorized(res);

      const data = await parseJson<{
        success: boolean;
        balance: number;
        error?: string;
      }>(res);

      if (!res.ok) {
        return {
          success: false,
          balance: 0,
          error: data?.error || 'Top-up failed',
        };
      }

      return (
        data || {
          success: false,
          balance: 0,
          error: 'Invalid server response',
        }
      );
    } catch {
      return {
        success: false,
        balance: 0,
        error: 'Network error during top-up',
      };
    }
  },

  /**
   * Get betting orders.
   */
  async getOrders(statusFilter: string = 'All'): Promise<BetOrder[]> {
    if (!authToken) {
      return [];
    }

    try {
      const encodedStatus = encodeURIComponent(statusFilter);

      const res = await fetch(
        `/api/orders?status=${encodedStatus}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      handleUnauthorized(res);

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await parseJson<BetOrder[]>(res);

      if (!data) {
        throw new Error('Invalid orders response');
      }

      return data;
    } catch {
      return [];
    }
  },

  /**
   * Place a bet/order.
   */
  async placeOrder(payload: {
    matchTitle: string;
    selection: string;
    odds: number;
    stake: number;
    matchId?: string;
  }): Promise<{
    success: boolean;
    order?: BetOrder;
    newBalance?: number;
    error?: string;
  }> {
    if (!authToken) {
      return {
        success: false,
        error: 'You must be logged in to place a bet',
      };
    }

    if (
      !payload.matchTitle ||
      !payload.selection ||
      !Number.isFinite(payload.odds) ||
      !Number.isFinite(payload.stake) ||
      payload.odds <= 0 ||
      payload.stake <= 0
    ) {
      return {
        success: false,
        error: 'Invalid betting information',
      };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: getHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(payload),
      });

      handleUnauthorized(res);

      const data = await parseJson<{
        success: boolean;
        order?: BetOrder;
        newBalance?: number;
        error?: string;
      }>(res);

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || 'Failed to place bet',
        };
      }

      return (
        data || {
          success: false,
          error: 'Invalid server response',
        }
      );
    } catch {
      return {
        success: false,
        error: 'Network error placing bet',
      };
    }
  },

  /**
   * Get admin dashboard analytics.
   */
  async getAdminAnalytics(): Promise<{
    analytics: AdminAnalytics;
    recentOrders: BetOrder[];
    matches: Match[];
  }> {
    try {
      const res = await fetch('/api/admin/analytics', {
        method: 'GET',
        headers: getHeaders(),
      });

      handleUnauthorized(res);

      if (!res.ok) {
        throw new Error('Failed to fetch admin analytics');
      }

      const data = await parseJson<{
        analytics: AdminAnalytics;
        recentOrders: BetOrder[];
        matches: Match[];
      }>(res);

      if (!data) {
        throw new Error('Invalid analytics response');
      }

      return data;
    } catch {
      // Mock fallback for development/demo mode.
      return {
        analytics: INITIAL_ANALYTICS,
        recentOrders: INITIAL_ORDERS,
        matches: INITIAL_MATCHES,
      };
    }
  },

  /**
   * Update an order status from the admin dashboard.
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<{
    success: boolean;
    order?: BetOrder;
    userBalance?: number;
    error?: string;
  }> {
    if (!authToken) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    if (!orderId || !status) {
      return {
        success: false,
        error: 'Order ID and status are required',
      };
    }

    try {
      const encodedOrderId = encodeURIComponent(orderId);

      const res = await fetch(
        `/api/admin/orders/${encodedOrderId}/status`,
        {
          method: 'POST',
          headers: getHeaders({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ status }),
        }
      );

      handleUnauthorized(res);

      const data = await parseJson<{
        success: boolean;
        order?: BetOrder;
        userBalance?: number;
        error?: string;
      }>(res);

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || 'Failed to update order status',
        };
      }

      return (
        data || {
          success: false,
          error: 'Invalid server response',
        }
      );
    } catch {
      return {
        success: false,
        error: 'Network error updating order',
      };
    }
  },

  /**
   * Login user.
   */
  async login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    access_token?: string;
    token_type?: string;
    user?: UserProfile;
    detail?: string;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await parseJson<{
        access_token?: string;
        token_type?: string;
        user?: UserProfile;
        detail?: string;
        message?: string;
      }>(res);

      if (!res.ok) {
        return {
          success: false,
          detail:
            data?.detail ||
            data?.message ||
            'Login failed',
        };
      }

      /**
       * Automatically store token after successful login.
       */
      if (data?.access_token) {
        setAuthToken(data.access_token);
      }

      return {
        success: true,
        access_token: data?.access_token,
        token_type: data?.token_type,
        user: data?.user,
      };
    } catch {
      return {
        success: false,
        detail: 'Network error',
      };
    }
  },

  /**
   * Register a new user.
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    access_token?: string;
    token_type?: string;
    user?: UserProfile;
    detail?: string;
  }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await parseJson<{
        access_token?: string;
        token_type?: string;
        user?: UserProfile;
        detail?: string;
        message?: string;
      }>(res);

      if (!res.ok) {
        return {
          success: false,
          detail:
            data?.detail ||
            data?.message ||
            'Registration failed',
        };
      }

      /**
       * Automatically store token after successful registration
       * if the backend returns one.
       */
      if (data?.access_token) {
        setAuthToken(data.access_token);
      }

      return {
        success: true,
        access_token: data?.access_token,
        token_type: data?.token_type,
        user: data?.user,
      };
    } catch {
      return {
        success: false,
        detail: 'Network error',
      };
    }
  },

  /**
   * Logout the current user.
   */
  logout(): void {
    setAuthToken(null);
  },
};

export default ApiService;