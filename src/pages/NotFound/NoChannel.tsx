import { useRouter } from "@/router/RouterProvider";
import S from "./NotFound.module.css";
function NoChannel() {
  const { setHistoryRoute } = useRouter();
  return (
    <div className={S.container}>
      <div className={S.info404}>
        <img src="/music_mate_symbol_fixed.svg" alt="MusicMate로고" />
        <h1>채널이 삭제되었거나 잘못된 경로로 접근하셨습니다</h1>
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setHistoryRoute("/");
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default NoChannel;
