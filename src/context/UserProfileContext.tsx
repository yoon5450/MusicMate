/* eslint-disable react-refresh/only-export-components */
import type { Tables } from "@/@types/database.types";
import { getUserProfileByUserId } from "@/api";
import { getAvatarUrl } from "@/api/user_avatar";
import { useAuth } from "@/auth/AuthProvider";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProfileContextType {
  setProfileIsChanged: () => void;
  userProfile:
    | (Tables<"user_profile"> & {
        avatarFile: Blob | null;
        profilePreview: string | null;
      })
    | null;
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
  const [isChanged, setIsChanged] = useState(false);
  const [userProfile, setUserProfile] = useState<
    | (Tables<"user_profile"> & {
        avatarFile: Blob | null;
        profilePreview: string | null;
      })
    | null
  >(null);
  const setProfileIsChanged = () => {
    setIsChanged(true);
  };

  const { user } = useAuth();

  useEffect(() => {
    if (!user || (!isChanged && userProfile)) return;
    const getUserInfo = async () => {
      const data = await getUserProfileByUserId(user.id);
      if (data) {
        if (data[0].profile_url)
          getAvatarUrl(data[0].profile_url).then((url) => {
            if (url)
              setUserProfile({
                ...data[0],
                profilePreview: URL.createObjectURL(url),
                avatarFile: url,
              });
          });
        else
          setUserProfile({
            ...data[0],
            profilePreview: null,
            avatarFile: null,
          });
        setIsChanged(false);
      }
    };
    getUserInfo();
  }, [isChanged, user]);

  //  getAvatarUrl(userInfo.profile_url).then((url) => {
  //       if (url) (URL.createObjectURL(url));
  //     });

  // React 19부터는 .Provider 없이 바로 <LoginModalContext> 사용
  return (
    <UserProfileContext value={{ setProfileIsChanged, userProfile }}>
      {children}
    </UserProfileContext>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("LoginModalProvider로 감싸야 합니다.");
  return ctx;
}
