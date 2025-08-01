/* eslint-disable react-refresh/only-export-components */
import { getUserPreferredGenre } from "@/api";
import { useAuth } from "@/auth/AuthProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserGenreContextType {
  setIsGenreChanged: () => void; // lastUpdatedAt -> 현재시점으로 바꿔주는 함수
  userGenre: number[]; // 장르코드배열
  lastUpdatedAt: number; // 마지막으로 업데이트된 시점
}

// Context 객체 생성
export const UserGenreContext = createContext<UserGenreContextType | null>(
  null
);

export function UserGenreProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const setIsGenreChanged = useCallback(() => {
    setLastUpdatedAt(Date.now());
  }, []);

  const [userGenre, setUserGenre] = useState<number[]>([]);

  const { user } = useAuth();

  const value = useMemo(
    () => ({ setIsGenreChanged, userGenre, lastUpdatedAt }),
    [setIsGenreChanged, userGenre, lastUpdatedAt]
  );

  // 유저가 바뀌거나 업데이트시점이 바뀌면 장르 가져오기
  useEffect(() => {
    const getUserGenre = async () => {
      const data = await getUserPreferredGenre();
      if (data) {
        setUserGenre(data);
      } else {
        alert("유저 선호 장르를 불러오지 못했습니다");
        setUserGenre([]);
      }
    };
    getUserGenre();
  }, [user, lastUpdatedAt]);

  return <UserGenreContext value={value}>{children}</UserGenreContext>;
}

export function useUserGenre() {
  const ctx = useContext(UserGenreContext);
  if (!ctx) throw new Error("UserGenreProvider로 감싸야 합니다.");
  return ctx;
}
