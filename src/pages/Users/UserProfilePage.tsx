import { useEffect, useState } from "react";
import { useParams } from "@/router/RouterProvider"
import S from "../Mypage/Mypage.module.css";
import logo from "@/assets/logo.svg";
import { getUserProfileByUserId } from "@/api";
import { getAvatarPublicUrl } from "@/utils/getAvatarPublicUrl";
import type { Tables } from "@/@types/database.types";



function UserProfilePage() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<Tables<"user_profile"> | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
  (async () => {
    if (!id) return;

    const data = await getUserProfileByUserId(id); 
    
    if (data && data.length > 0) {
      setUserProfile(data[0]);
      setAvatarUrl(getAvatarPublicUrl(data[0].profile_url));
    }
  })();
}, [id]);


  if (!userProfile) return <div>로딩 중...</div>;

  return (
    <div className={S.container}>
      <div className={S.editUserInfoForm}>
        <div className={S.editUserAvatar}>
          <img
            src={avatarUrl ?? logo}
            alt={`${userProfile.nickname}의 프로필 이미지`}
            className={S.userAvatar}
          />
        </div>
        <div className={S.formInput}>
          <div className={S.formControl}>
            <label htmlFor="nickname">닉네임</label>
            <input id="nickname"type="text" value={userProfile.nickname} readOnly />
          </div>
          <div className={S.formControl}>
            <label htmlFor="description">설명</label>
            <textarea id="description" value={userProfile.description ?? ""} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;