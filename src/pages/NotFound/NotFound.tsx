import S from "./NotFound.module.css";

function NotFound() {
  //   const { setHistoryRoute } = useContext(RouterContext)!;

  return (
    <div className={S.container}>
      <div className={S.info404}>
        <img src="music_mate_symbol_fixed.svg" alt="MusicMate로고" />
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
