import S from "./Header.module.css";
import bell from "@/assets/bell.svg";
import propile from "@/assets/propile.svg";

function Header() {
  return (
    <header className={S.topHeader}>
      <img src="music_mate_symbol_fixed.svg" className={S.logo} />
      <div className={S.content}>검색창 또는 현재 보고 있는 Page 표시</div>
      <div className={S.btnGroup}>
        <img src={bell} alt="알림" />
        <img src={propile} alt="유저프로필" />
      </div>
    </header>
  );
}

export default Header;
