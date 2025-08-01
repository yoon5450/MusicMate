import S from "./Mypage.module.css";
// import { getUserProfileByUserId } from "@/api";

import UserProfile from "./components/UserProfile";
import GenreSelect from "./components/GenreSelect";
import { useUserProfile } from "@/context/UserProfileContext";
import { useAuth } from "@/auth/AuthProvider";
import YouNeedToLogin from "../NotFound/YouNeedToLogin";

function Mypage() {
  const { user } = useAuth();
  const { setProfileIsChanged, userProfile } = useUserProfile();

  if (!user) return <YouNeedToLogin />;

  return (
    <div className={S.container}>
      <UserProfile
        userInfo={userProfile}
        setProfileIsChanged={setProfileIsChanged}
      />
      <GenreSelect user={user} />
    </div>
  );
}

export default Mypage;
