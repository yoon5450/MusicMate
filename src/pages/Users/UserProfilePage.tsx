import { useEffect, useState } from "react";
import { useParams } from "@/router/RouterProvider"
import { getUserProfileByUserId } from "@/api";
import type { Tables } from "@/@types/database.types";
import UserProfileReadOnly from "./components/UserProfileReadOnly";
import GenreSelectReadOnly from "./components/GenreSelectReadOnly";
import S from "../Mypage/Mypage.module.css";



function UserProfilePage() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<Tables<"user_profile"> | null>(null);
  // const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
  (async () => {
    if (!id) return;

    const data = await getUserProfileByUserId(id); 
    
    if (data && data.length > 0) {
      setUserProfile(data[0]);
      // setAvatarUrl(getAvatarPublicUrl(data[0].profile_url));
    }
  })();
}, [id]);


  if (!userProfile) return <div>로딩 중...</div>;

  return (
    <div className={S.container}>
      <UserProfileReadOnly userInfo={userProfile} />
      <GenreSelectReadOnly userId ={userProfile.id}/>
    </div>
  );
}

export default UserProfilePage;