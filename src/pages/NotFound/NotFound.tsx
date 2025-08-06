import { useRouter } from "@/router/RouterProvider";
import S from "./NotFound.module.css";

interface Props {
  info?: string;
}

function NotFound({ info = "404 NOT FOUND" }: Props) {
  const { setHistoryRoute } = useRouter();
  return (
    <div className={S.container}>
      <div className={S.info404}>
        <img src="/music_mate_symbol_fixed.svg" alt="MusicMate로고" />
        <h1>{info}</h1>
      </div>
      <a
        href="#"
        onClick={() => {
          history.pushState(null, "", "/");
          setHistoryRoute("/");
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default NotFound;
