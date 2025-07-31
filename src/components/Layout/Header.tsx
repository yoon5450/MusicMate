import S from "./Header.module.css";
import bell from "@/assets/bell.svg";
import propile from "@/assets/propile.svg";
import search from "@/assets/search_icon.svg";
import { useAuth } from "@/auth/AuthProvider";
import { useLoginModal } from "@/context/LoginModalContext";
import { useState } from "react";

interface Props {
  currentPage: string;
  setHistoryRoute: (to: string) => void;
}

// 상위 요소에서 useRoute를 받아오도록 수정
// TODO : 채널에 관한 정보를 뽑아서 전달해 주는 방법
function Header({ currentPage, setHistoryRoute }: Props) {
  const { openLogin } = useLoginModal();
  const { isAuth, logout } = useAuth();
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>();

  const handleLoginModal = () => {
    // 로그인 모달창 열기
    openLogin();
  };

  const handleClickLogo = () => {
    setHistoryRoute("/");
    history.pushState(null, "", "/");
  };

  const handleMyPage = () => {
    if (isAuth) {
      history.pushState(null, "", `/mypage`);
      setHistoryRoute(`/mypage`);
    } else {
      handleLoginModal();
    }
  };

  const handleLogout = () => {
    // 로그아웃 하기
    logout();
  };

  const searchInput = (
    <input
      className={S.searchInput}
      type="text"
      placeholder="검색어를 입력하세요"
      onChange={(e) => setKeyword(e.target.value)}
    />
  );

  return (
    <header className={S.topHeader}>
      <button
        type="button"
        className={S.headerButton}
        onClick={handleClickLogo}
      >
        <img src="/music_mate_symbol_fixed.svg" className={S.logo} />
      </button>
      {isSearch ? searchInput : <div className={S.content}>{currentPage}</div>}
      <div className={S.btnGroup}>
        <button
          type="button"
          className={S.headerButton}
          onClick={() => setIsSearch(true)}
        >
          <img src={search} width={"36px"} alt="검색" />
        </button>
        <button type="button" className={S.headerButton}>
          <img src={bell} width={"44px"} alt="알림" />
        </button>
        <button type="button" className={S.headerButton} onClick={handleMyPage}>
          <img src={propile} width={"44px"} alt="유저프로필" />
        </button>
        {isAuth ? (
          <button type="button" className={S.authButton} onClick={handleLogout}>
            LogOut
          </button>
        ) : (
          <button
            type="button"
            className={S.authButton}
            onClick={handleLoginModal}
          >
            LogIn
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
