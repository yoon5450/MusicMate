import S from "./Mypage.module.css";
// import { getUserProfileByUserId } from "@/api";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { getUserProfileByUserId } from "@/api";
import type { Tables } from "@/@types/database.types";
import UserProfile from "./components/UserProfile";
import GenreSelect from "./components/GenreSelect";

function Mypage() {
  const [userInfo, setUserInfo] = useState<Tables<"user_profile"> | null>(null);
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      return data.user.id;
    };
    const getUserInfo = async (id: string) => {
      const data = await getUserProfileByUserId(id);
      if (data) return data;
    };
    getUserId().then(async (data) => {
      if (!data) return;
      const userInfo = await getUserInfo(data);
      if (!userInfo) return;
      setUserInfo(userInfo[0]);
    });
  }, []);
  // getUserProfileByUserId();
  return (
    <div className={S.container}>
      <UserProfile userInfo={userInfo} />
      <div className={S.myGenre}>
        <GenreSelect />
      </div>
    </div>
  );
}

export default Mypage;
