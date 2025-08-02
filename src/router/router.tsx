import Channel from "@/pages/Channel";
import Main from "@/pages/Main";
import Mypage from "@/pages/Mypage/Mypage";
import UserProfilePage from "@/pages/Users/UserProfilePage";

export const routes = [
  {
    title: "메인",
    path: "/",
    element: <Main />,
  },
  {
    title: "채널 상세",
    path: "/Channel/:id", // 동적 라우팅
    element: <Channel />,
  },
  {
    title: "채널 상세",
    path: "/Channel/:id/feed/:feedId", // 동적 라우팅
    element: <Channel />,
  },
  {
    title: "마이페이지",
    path: "/mypage",
    element: <Mypage />,
  },
  {
    title: "유저 프로필 페이지",
    path: "/user/:id",
    element: <UserProfilePage />,
  },
];
