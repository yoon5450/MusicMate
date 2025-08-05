/* eslint-disable react-refresh/only-export-components */
import type { Tables } from "@/@types/database.types";
import { getChannels } from "@/api";
import { useAuth } from "@/auth/AuthProvider";
import { showToast } from "@/components/common/CustomAlert";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ChannelContextType {
  setIsChannelChanged: () => void; // lastUpdatedAt -> 현재시점으로 바꿔주는 함수
  channelList: Tables<"channels">[]; // 채널정보배열
  lastUpdatedAt: number; // 마지막으로 업데이트된 시점
}

// Context 객체 생성
export const ChannelContext = createContext<ChannelContextType | null>(null);

export function ChannelProvier({ children }: { children: React.ReactNode }) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const setIsChannelChanged = useCallback(() => {
    setLastUpdatedAt(Date.now());
  }, []);

  const [channelList, setChannelList] = useState<Tables<"channels">[]>([]);

  const { user } = useAuth();

  const value = useMemo(
    () => ({ setIsChannelChanged, channelList, lastUpdatedAt }),
    [setIsChannelChanged, channelList, lastUpdatedAt]
  );

  // 유저가 바뀌거나 업데이트시점이 바뀌면 장르 가져오기
  useEffect(() => {
    const getChannelList = async () => {
      const data = await getChannels();
      if (data) {
        setChannelList(data);
      } else {
        showToast("채널 정보를 업데이트하지 못했습니다");
        setChannelList([]);
      }
    };
    getChannelList();
  }, [user, lastUpdatedAt]);

  return <ChannelContext value={value}>{children}</ChannelContext>;
}

export function useChannel() {
  const ctx = useContext(ChannelContext);
  if (!ctx) throw new Error("ChannelProvider로 감싸야 합니다.");
  return ctx;
}
