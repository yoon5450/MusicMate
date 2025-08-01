import type { Tables } from "@/@types/database.types";
import { getAvatarPublicUrl } from "@/utils/getAvatarPublicUrl";
import S from "../../Mypage/Mypage.module.css";
import logo from "@/assets/logo.svg";


interface Props {
  userInfo: Tables<"user_profile">;
}

function UserProfileReadOnly({userInfo}:Props) {
  const avatarUrl = getAvatarPublicUrl(userInfo.profile_url);


  return (
    <div className={S.profileContainer}>
      <h3>유저 프로필</h3>
      <div className={S.editUserInfoForm}>
        <div className={S.editUserAvatar}>
           <img
            src={avatarUrl ?? logo}
            alt={`${userInfo.nickname}의 프로필 이미지`}
            className={S.userAvatar}
          />
        </div>
      </div>
      <div className={S.formInput}>
        <div className={S.formControl}>
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname"type="text" value={userInfo.nickname} readOnly />
        </div>
        <div className={S.formControl}>
          <label htmlFor="description">설명</label>
          <textarea id="description" value={userInfo.description ?? ""} readOnly />
        </div>
      </div>
    </div>
  )
}
export default UserProfileReadOnly