import S from "./NotFound.module.css";
import logo from "@/assets/logo.svg";

function NotFound() {
  //   const { setHistoryRoute } = useContext(RouterContext)!;

  return (
    <div className={S.container}>
      <div className={S.info404}>
        <img src={logo} alt="MusicMate로고" />
        <h1>404 NOT FOUND</h1>
      </div>
      <a
        href="#"
        // onClick={(e) => {
        //   e.preventDefault();
        //   history.pushState(null, "", "/");
        //   setHistoryRoute("/");
        // }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default NotFound;
