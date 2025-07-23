import S from "./Header.module.css";
import bell from "@/assets/bell.svg";
import propile from "@/assets/propile.svg";
import { useRouter } from "@/router/RouterProvider";

function Header() {
  const { setHistoryRoute } = useRouter();

  const handleClickLogo = () =>{
    setHistoryRoute("/")
    history.pushState(null, '', '/')
  }

  return (
    <header className={S.topHeader}>
      <button
        type="button"
        className={S.headerButton}
        onClick={handleClickLogo}
      >
        <img src="/music_mate_symbol_fixed.svg" className={S.logo} />
      </button>
      <div className={S.content}>검색창 또는 현재 보고 있는 Page 표시</div>
      <div className={S.btnGroup}>
        <button type="button" className={S.headerButton}>
          <img src={bell} width={"44px"} alt="알림" />
        </button>
        <button type="button" className={S.headerButton}>
          <img src={propile} width={"44px"} alt="유저프로필" />
        </button>
      </div>
    </header>
  );
}

export default Header;
