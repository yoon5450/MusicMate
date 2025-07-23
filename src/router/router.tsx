import Channel from "@/pages/Channel";
import Main from "@/pages/Main";

export const routes = [
  {
    title: "메인",
    path: "/",
    element: <Main />,
  },
  {
    title: "채널",
    path: "/Channel/:id", // 동적 라우팅
    element: <Channel />,
  },
];
