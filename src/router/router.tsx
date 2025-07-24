import MessageTestPage from "@/Page/MessageTestPage";
import Channel from "@/pages/Channel";
import Main from "@/pages/Main";
import Mypage from "@/pages/Mypage/Mypage";

export const routes = [
  {
    title: "메인",
    path: "/",
    element: <Main />,
  },
  {
    title: "채널",
    path: "/Channel", // 동적 라우팅
    element: <Channel />,
  },
  {
    title: "채널 상세",
    path: "/Channel/:id", // 동적 라우팅
    element: <Channel />,
  },
  {
    title: "피드테스트",
    path: "/messageTest",
    element: <MessageTestPage />,
  },
  {
    title: "마이페이지",
    path: "/mypage",
    element: <Mypage />,
  },
];
