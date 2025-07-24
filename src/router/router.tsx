import Channel from "@/pages/Channel";
import Main from "@/pages/main";

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
];
