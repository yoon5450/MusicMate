/* eslint-disable react-refresh/only-export-components */
import type { Tables } from "@/@types/database.types";
import { getUserProfileByUserId } from "@/api";
import { getAvatarUrlPreview } from "@/api/user_avatar";
import { useAuth } from "@/auth/AuthProvider";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProfileContextType {
  setProfileIsChanged: () => void;
  userProfile:
    | (Tables<"user_profile"> & {
        profilePreview: string | null;
      })
    | null;
  lastUpdatedAt: number;
}

// Context 객체 생성
export const UserProfileContext = createContext<UserProfileContextType | null>(
  null
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const setProfileIsChanged = () => {
    setLastUpdatedAt(Date.now());
  };

  const [userProfile, setUserProfile] = useState<
    | (Tables<"user_profile"> & {
        profilePreview: string | null;
      })
    | null
  >(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getUserInfo = async () => {
      const data = await getUserProfileByUserId(user.id);
      if (data) {
        if (data[0].profile_url) {
          const url = getAvatarUrlPreview(data[0].profile_url);
          if (url) {
            setUserProfile({
              ...data[0],
              profilePreview: url,
            });
          } else {
            setUserProfile({
              ...data[0],
              profilePreview: null,
            });
          }
        } else {
          setUserProfile({
            ...data[0],
            profilePreview: null,
          });
        }
      }
    };

    getUserInfo();
  }, [user, lastUpdatedAt]);

  return (
    <UserProfileContext.Provider
      value={{ setProfileIsChanged, userProfile, lastUpdatedAt }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("UserProfileProvider로 감싸야 합니다.");
  return ctx;
}
