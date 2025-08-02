import { useRouter } from "@/router/RouterProvider";
import S from "./NotFound.module.css";
import { useLoginModal } from "@/context/LoginModalContext";
function YouNeedToLogin() {
  const { openLogin } = useLoginModal();
  const { setHistoryRoute } = useRouter();
  return (
    <div className={S.container}>
      <div className={S.info404}>
        <img src="/music_mate_symbol_fixed.svg" alt="MusicMate로고" />
        <h1>회원에게만 공개된 페이지입니다</h1>
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openLogin();
          setHistoryRoute("/");
        }}
      >
        로그인하기
      </a>
    </div>
  );
}

export default YouNeedToLogin;
