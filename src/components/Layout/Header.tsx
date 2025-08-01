import S from "./Header.module.css";
import bell from "@/assets/bell.svg";
import propile from "@/assets/propile.svg";
import search from "@/assets/search_icon.svg";
import { useAuth } from "@/auth/AuthProvider";
import { useLoginModal } from "@/context/LoginModalContext";
import React, { useEffect, useState } from "react";
import HeaderSearch from "@/components/HearderSearch/HeaderSearch";

interface Props {
  currentPage: string;
  setHistoryRoute: (to: string) => void;
}

// 상위 요소에서 useRoute를 받아오도록 수정
function Header({ currentPage, setHistoryRoute }: Props) {
  const { openLogin } = useLoginModal();
  const { isAuth, logout } = useAuth();
  const [isSearch, setIsSearch] = useState<boolean>(false);

  // document 단에서 키보드 이벤트로 탐지
  useEffect(() => {
    const searchPop = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        setIsSearch((prev) => !prev);
      }

      if (e.key === "Escape") {
        setIsSearch(false);
      }
    };

    document.addEventListener("keydown", searchPop);
    return () => {
      document.removeEventListener("keydown", searchPop);
    };
  }, []);

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

  return (
    <header className={S.topHeader}>
      <button
        type="button"
        className={S.headerButton}
        onClick={handleClickLogo}
      >
        <img src="/music_mate_symbol_fixed.svg" className={S.logo} />
      </button>
      {isSearch ? (
        <HeaderSearch setIsSearch={setIsSearch} />
      ) : (
        <div className={S.content}>{currentPage}</div>
      )}
      <div className={S.btnGroup}>
        <button
          type="button"
          className={S.headerButton}
          onClick={() => setIsSearch(true)}
        >
          <div>
            <img src={search} width={"36px"} alt="검색" />
          </div>
        </button>
        <button type="button" className={S.headerButton}>
          <div>
            <img src={bell} width={"44px"} alt="알림" />
          </div>
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
