import S from "./Mypage.module.css";
// import { getUserProfileByUserId } from "@/api";

import UserProfile from "./components/UserProfile";
import GenreSelect from "./components/GenreSelect";
import { useUserProfile } from "@/context/UserProfileContext";

function Mypage() {
  const { setProfileIsChanged, userProfile } = useUserProfile();

  return (
    <div className={S.container}>
      <UserProfile
        userInfo={userProfile}
        setProfileIsChanged={setProfileIsChanged}
      />
      <div className={S.myGenre}>
        <GenreSelect />
      </div>
    </div>
  );
}

export default Mypage;
