import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import supabase from "@/utils/supabase";
import { signOut } from "@/api/auth";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      // 유효한 user인지 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setUser({ id: user.id, email: user.email! });
    })();

    // 로그인/로그아웃 인증 상태가 바뀌는것 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // 클린업
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    const { error } = await signOut();

    if (error) console.error("Logout error:", error.message);

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuth: Boolean(user),
      logout,
    }),
    [user, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("<AuthProvider> 내부에서만 사용 가능합니다.");
  return ctx;
}
