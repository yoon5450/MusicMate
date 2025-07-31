/**
 * 유저의 프로필 이미지와 닉네임을 클릭하면 해당 유저의 상세페이지로 라우팅한다.
 */

import S from "./UserProfileLink.module.css";
import { useRouter } from "@/router/RouterProvider";

interface UserProfileLinkProps {
  userId: string;
  nickname: string;
  profileUrl?: string;
}

function UserProfileLink({
  userId,
  nickname,
  profileUrl,
}: UserProfileLinkProps) { 
  const { setHistoryRoute } = useRouter();

  const handleClick = () => {
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`); 
  };

  return (
    <div 
      className={S.wrapper} 
      onClick={handleClick} 
      onKeyDown={(e) => {if(e.key === "Enter") handleClick();}}
      role="button" tabIndex={0}
      aria-label={`${nickname}의 상세페이지로 이동`}  
    >
      <img
        src={profileUrl ?? "/music_mate_symbol_fixed.svg"}
        alt={`${nickname}의 프로필이미지`}
        className={S.avatar}
      />
      <span className={S.nickname}>{nickname}</span>
    </div>
  );
}

export default UserProfileLink;
