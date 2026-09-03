"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { ApiService, setAuthToken } from "@/services/api";

import {
  Match,
  BetOrder,
  UserProfile,
  AdminAnalytics,
  BetSelection,
} from "@/types";

import {
  INITIAL_MATCHES,
  INITIAL_ANALYTICS,
} from "@/data/mockData";

/* =========================================================
   TYPES
========================================================= */

interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;

  matches: Match[];
  orders: BetOrder[];
  user: UserProfile | null;
  analytics: AdminAnalytics | null;

  activeSelections: BetSelection[];

  isTopUpOpen: boolean;
  setIsTopUpOpen: (value: boolean) => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (value: boolean) => void;

  authView: "login" | "register";
  setAuthView: (value: "login" | "register") => void;

  logout: () => void;

  handleSelectOdd: (
    match: Match,
    marketName: string,
    optionName: string,
    odds: number
  ) => void;

  handleRemoveSelection: (
    matchId: string,
    optionName: string
  ) => void;

  handleClearSelections: () => void;

  handlePlaceBet: (
    selection: BetSelection,
    stake: number
  ) => Promise<boolean>;

  handlePlaceVirtualBet: (
    matchTitle: string,
    selection: string,
    odds: number,
    stake: number
  ) => Promise<boolean>;

  handleCashoutOrder: (
    orderId: string,
    cashoutAmount: number
  ) => void;

  handleTopUpConfirm: (
    amount: number
  ) => Promise<boolean>;

  handleUpdateOrderStatus: (
    orderId: string,
    status: string
  ) => Promise<void>;

  setUser: React.Dispatch<
    React.SetStateAction<UserProfile | null>
  >;
}

interface ApiUserData {
  id: string | number;
  full_name?: string;
  name?: string;
  email?: string;
  demo_balance?: number | string | null;
  demoBalance?: number | string | null;
  created_at?: string;
}

/* =========================================================
   CONTEXT
========================================================= */

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

/* =========================================================
   PROVIDER
========================================================= */

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /* =======================================================
     THEME
  ======================================================= */

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem(
      "kingsbet_theme"
    );

    return savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "dark";
  });

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next =
        previous === "dark" ? "light" : "dark";

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "kingsbet_theme",
          next
        );
      }

      return next;
    });
  }, []);

  /* =======================================================
     APPLICATION STATE
  ======================================================= */

  const [matches, setMatches] =
    useState<Match[]>(INITIAL_MATCHES);

  const [orders, setOrders] =
    useState<BetOrder[]>([]);

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [analytics, setAnalytics] =
    useState<AdminAnalytics | null>(
      INITIAL_ANALYTICS
    );

  const [activeSelections, setActiveSelections] =
    useState<BetSelection[]>([]);

  const [isTopUpOpen, setIsTopUpOpen] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const [authView, setAuthView] =
    useState<"login" | "register">("login");

  /* =======================================================
     LOAD MATCHES + RESTORE SESSION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadApplication = async () => {
      /* -----------------------------------------------
         Load public matches
      ------------------------------------------------ */

      try {
        const matchList =
          await ApiService.getMatches();

        if (
          mounted &&
          Array.isArray(matchList) &&
          matchList.length > 0
        ) {
          setMatches(matchList);
        }
      } catch (error) {
        console.error(
          "Failed to load matches:",
          error
        );
      }

      /* -----------------------------------------------
         Restore authenticated session
      ------------------------------------------------ */

      if (
        typeof window === "undefined"
      ) {
        return;
      }

      const savedToken =
        localStorage.getItem("kb_token");

      if (!savedToken) {
        return;
      }

      try {
        /*
         * ApiService loads the token when the module
         * initializes. Setting it again here guarantees
         * that the restored token is active.
         */
        setAuthToken(savedToken);

        const userData =
          await ApiService.getUser();

        if (
          mounted &&
          userData &&
          userData.id
        ) {
          const profile = userData as unknown as ApiUserData;

          setUser({
            id: String(profile.id),

            name:
              profile.full_name ||
              profile.name ||
              "",

            email:
              profile.email || "",

            demoBalance: Number(
              profile.demo_balance ??
              profile.demoBalance ??
              0
            ),

            joinedDate:
              profile.created_at
                ? new Date(
                    profile.created_at
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Recently",
          });
        }
      } catch (error) {
        console.error(
          "Failed to restore session:",
          error
        );

        setAuthToken(null);

        if (mounted) {
          setUser(null);
        }
      }
    };

    loadApplication();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOAD USER ORDERS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      try {
        const orderList =
          await ApiService.getOrders();

        if (
          mounted &&
          Array.isArray(orderList)
        ) {
          setOrders(orderList);
        }
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );

        if (mounted) {
          setOrders([]);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  /* =======================================================
     SELECT BETTING ODDS
  ======================================================= */

  const handleSelectOdd = (
    match: Match,
    marketName: string,
    optionName: string,
    odds: number
  ) => {
    if (!match?.id || !optionName) {
      return;
    }

    setActiveSelections((previous) => {
      const alreadySelected =
        previous.some(
          (selection) =>
            selection.matchId === match.id &&
            selection.marketName === marketName &&
            selection.optionName === optionName
        );

      /*
       * Clicking an already selected odd removes it.
       */
      if (alreadySelected) {
        return previous.filter(
          (selection) =>
            !(
              selection.matchId === match.id &&
              selection.marketName === marketName &&
              selection.optionName === optionName
            )
        );
      }

      /*
       * Remove any existing selection from the
       * same match + market before adding the new one.
       *
       * This prevents selecting both Home and Away
       * for the same 1X2 market.
       */
      const filtered = previous.filter(
        (selection) =>
          !(
            selection.matchId === match.id &&
            selection.marketName === marketName
          )
      );

      const homeName =
        match.homeTeam?.name || "Home";

      const awayName =
        match.awayTeam?.name || "Away";

      const newSelection: BetSelection = {
        matchId: String(match.id),

        matchTitle:
          `${homeName} vs ${awayName}`,

        leagueName:
          match.leagueName || "League",

        marketName:
          marketName || "1X2",

        optionName,

        odds:
          Number.isFinite(odds) && odds > 0
            ? odds
            : 1,
      };

      return [
        ...filtered,
        newSelection,
      ];
    });
  };

  /* =======================================================
     REMOVE ONE SELECTION
  ======================================================= */

  const handleRemoveSelection = (
    matchId: string,
    optionName: string
  ) => {
    setActiveSelections((previous) =>
      previous.filter(
        (selection) =>
          !(
            selection.matchId === matchId &&
            selection.optionName === optionName
          )
      )
    );
  };

  /* =======================================================
     CLEAR BET SLIP
  ======================================================= */

  const handleClearSelections = () => {
    setActiveSelections([]);
  };

  /* =======================================================
     PLACE REAL API BET
  ======================================================= */

  const handlePlaceBet = async (
    selection: BetSelection,
    stake: number
  ): Promise<boolean> => {
    if (!user) {
      setAuthView("login");
      setIsAuthModalOpen(true);
      return false;
    }

    if (
      !Number.isFinite(stake) ||
      stake <= 0
    ) {
      return false;
    }

    if (user.demoBalance < stake) {
      setIsTopUpOpen(true);
      return false;
    }

    try {
      const response =
        await ApiService.placeOrder({
          matchTitle:
            selection.matchTitle,

          selection:
            selection.optionName,

          odds:
            selection.odds,

          stake,

          matchId:
            selection.matchId,
        });

      if (
        !response.success ||
        !response.order
      ) {
        return false;
      }

      /* -----------------------------------------------
         Update balance
      ------------------------------------------------ */

      setUser((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,

          demoBalance:
            response.newBalance ??
            previous.demoBalance - stake,
        };
      });

      /* -----------------------------------------------
         Add new order to top of list
      ------------------------------------------------ */

      setOrders((previous) => [
        response.order!,
        ...previous,
      ]);

      /* -----------------------------------------------
         Remove placed selection
      ------------------------------------------------ */

      setActiveSelections((previous) =>
        previous.filter(
          (item) =>
            item.matchId !==
            selection.matchId
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to place bet:",
        error
      );

      return false;
    }
  };

  /* =======================================================
     PLACE VIRTUAL BET
  ======================================================= */

  const handlePlaceVirtualBet = async (
    matchTitle: string,
    selection: string,
    odds: number,
    stake: number
  ): Promise<boolean> => {
    if (!user) {
      setAuthView("login");
      setIsAuthModalOpen(true);
      return false;
    }

    if (
      !Number.isFinite(stake) ||
      stake <= 0
    ) {
      return false;
    }

    if (
      !Number.isFinite(odds) ||
      odds <= 0
    ) {
      return false;
    }

    if (user.demoBalance < stake) {
      setIsTopUpOpen(true);
      return false;
    }

    /*
     * IMPORTANT:
     * Virtual bets in your original code were only
     * stored in React state. They disappeared after
     * refreshing the browser.
     *
     * If your backend treats virtual bets as normal
     * orders, send them through the API.
     */

    try {
      const response =
        await ApiService.placeOrder({
          matchTitle,
          selection,
          odds,
          stake,
          matchId: "virtual-1",
        });

      if (
        response.success &&
        response.order
      ) {
        setUser((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            demoBalance:
              response.newBalance ??
              previous.demoBalance - stake,
          };
        });

        setOrders((previous) => [
          response.order!,
          ...previous,
        ]);

        return true;
      }

      /*
       * Fallback to local virtual bet if your
       * backend doesn't support virtual-1.
       *
       * Remove this fallback if you want all bets
       * to require a working backend.
       */

      const newOrder: BetOrder = {
        id: `KB-VIRT-${Math.floor(
          10000 +
            Math.random() * 90000
        )}`,

        matchId: "virtual-1",

        matchTitle,

        selection,

        odds,

        stake,

        potentialWin:
          Math.round(stake * odds),

        status: "Pending",

        timestamp: "Just Now",

        userId: user.id,

        userEmail: user.email,

        bookingCode:
          `KB-V-${Math.floor(
            100 +
              Math.random() * 900
          )}`,
      };

      setUser((previous) =>
        previous
          ? {
              ...previous,
              demoBalance:
                previous.demoBalance -
                stake,
            }
          : null
      );

      setOrders((previous) => [
        newOrder,
        ...previous,
      ]);

      return true;
    } catch (error) {
      console.error(
        "Failed to place virtual bet:",
        error
      );

      return false;
    }
  };

  /* =======================================================
     CASHOUT
  ======================================================= */

  const handleCashoutOrder = (
    orderId: string,
    cashoutAmount: number
  ) => {
    if (
      !orderId ||
      !Number.isFinite(cashoutAmount) ||
      cashoutAmount <= 0
    ) {
      return;
    }

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Won",
              wonAmount:
                cashoutAmount,
            }
          : order
      )
    );

    setUser((previous) =>
      previous
        ? {
            ...previous,
            demoBalance:
              previous.demoBalance +
              cashoutAmount,
          }
        : null
    );
  };

  /* =======================================================
     TOP UP
  ======================================================= */

  const handleTopUpConfirm = async (
    amount: number
  ): Promise<boolean> => {
    if (!user) {
      setAuthView("login");
      setIsAuthModalOpen(true);
      return false;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return false;
    }

    try {
      const response =
        await ApiService.topUpDemoPoints(
          amount
        );

      if (!response.success) {
        return false;
      }

      setUser((previous) =>
        previous
          ? {
              ...previous,
              demoBalance:
                response.balance,
            }
          : null
      );

      return true;
    } catch (error) {
      console.error(
        "Top-up failed:",
        error
      );

      return false;
    }
  };

  /* =======================================================
     ADMIN ORDER STATUS
  ======================================================= */

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string
  ): Promise<void> => {
    if (!orderId || !status) {
      return;
    }

    try {
      const response =
        await ApiService.updateOrderStatus(
          orderId,
          status
        );

      if (!response.success) {
        return;
      }

      /*
       * If backend returns the complete updated
       * order, use it.
       */
      if (response.order) {
        setOrders((previous) =>
          previous.map((order) =>
            order.id === orderId
              ? response.order!
              : order
          )
        );
      } else {
        /*
         * Otherwise update just the status locally.
         */
        setOrders((previous) =>
          previous.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: status as BetOrder["status"],
                }
              : order
          )
        );
      }

      /*
       * Backend should be the source of truth
       * for the user's balance.
       */
      if (
        response.userBalance !== undefined
      ) {
        setUser((previous) =>
          previous
            ? {
                ...previous,
                demoBalance:
                  response.userBalance!,
              }
            : null
        );
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    setAuthToken(null);

    setUser(null);

    setOrders([]);

    setActiveSelections([]);

    setIsAuthModalOpen(false);

    setIsTopUpOpen(false);

    setMobileSidebarOpen(false);

    setAuthView("login");
  };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const contextValue: AppContextType = {
    theme,

    toggleTheme,

    matches,

    orders,

    user,

    analytics,

    activeSelections,

    isTopUpOpen,

    setIsTopUpOpen,

    mobileSidebarOpen,

    setMobileSidebarOpen,

    isAuthModalOpen,

    setIsAuthModalOpen,

    authView,

    setAuthView,

    logout,

    handleSelectOdd,

    handleRemoveSelection,

    handleClearSelections,

    handlePlaceBet,

    handlePlaceVirtualBet,

    handleCashoutOrder,

    handleTopUpConfirm,

    handleUpdateOrderStatus,

    setUser,
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AppContext.Provider value={contextValue}>
      <div
        className={`
          min-h-screen
          font-sans
          antialiased
          selection:bg-[#00b050]
          selection:text-white
          flex
          flex-col
          justify-between
          transition-colors
          duration-200
          ${
            theme === "light"
              ? "bg-slate-100 text-slate-900 light"
              : "bg-[#12151a] text-slate-100 dark"
          }
        `}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useAppContext(): AppContextType {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used within an AppProvider"
    );
  }

  return context;
}