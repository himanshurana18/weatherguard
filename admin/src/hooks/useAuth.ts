// import { useEffect, useState } from "react";
// import api from "../lib/api";

// export interface User {
//   _id: string;
//   email: string;
//   name: string;
//   role: "user" | "admin";
//   status: "pending" | "approved" | "rejected";
//   telegramChatId?: string;
//   telegramUsername?: string;
//   location?: { city: string; lat: number; lon: number };
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = new URLSearchParams(window.location.search).get("token");
//     if (token) {
//       localStorage.setItem("token", token);
//       window.history.replaceState({}, "", "/login");
//     }

//     if (localStorage.getItem("token")) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const response = await api.get("/auth/me");
//       setUser(response.data);
//     } catch {
//       localStorage.removeItem("token");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return { user, loading, logout };
// }
import { useEffect, useState } from "react";
import api from "../lib/api";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  status: "pending" | "approved" | "rejected";
  telegramChatId?: string;
  telegramUsername?: string;
  location?: { city: string; lat: number; lon: number };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
    }

    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, loading, logout, refetchUser: fetchUser };
}
