import S from "./Header.module.css";
import profile from "@/assets/propile.svg";
import search from "@/assets/search_icon.svg";
import { useAuth } from "@/auth/AuthProvider";
import { useLoginModal } from "@/context/LoginModalContext";
import { useEffect, useState } from "react";
import HeaderSearch from "@/components/HearderSearch/HeaderSearch";
import { confirmAlert, showToast } from "../common/CustomAlert";
import hambergerIcon from "@/assets/hamburger_icon.svg";

interface Props {
  setHistoryRoute: (to: string) => void;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

// 상위 요소에서 useRoute를 받아오도록 수정
function Header({ setHistoryRoute, setIsSidebarOpen, isMobile }: Props) {
  const { openLogin } = useLoginModal();
  const { isAuth, logout } = useAuth();
  const [isSearch, setIsSearch] = useState<boolean>(false);

  // document 단에서 키보드 이벤트로 탐지
  useEffect(() => {
    const searchPop = (e: KeyboardEvent) => {
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        setIsSearch((prev) => !prev);
      }

      if (e.key === "Escape") {
        setIsSearch(false);
      }
    };

    console.log("이벤트 부여");
    document.addEventListener("keydown", searchPop);
    return () => {
      console.log("이벤트 사라짐");

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
    confirmAlert("로그아웃 하시겠습니까?").then((result) => {
      if (result.isConfirmed) {
        logout().then(() => {
          showToast("로그아웃 되었습니다");
        });
      }
    });
  };

  return (
    <div className={S.topHeader}>
      <button
        className={`${S.headerButton}`}
        type="button"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <img src={hambergerIcon} alt="" />
      </button>

      <button type="button" className={S.logoBtn} onClick={handleClickLogo}>
        <div>
          <img src="/music_mate_symbol_fixed.svg" className={S.logo} />
        </div>
        {isMobile ? null : <div>MusicMate</div>}
      </button>

      {isSearch ? <HeaderSearch setIsSearch={setIsSearch} /> : ""}

      <div className={S.btnGroup}>
        <button
          type="button"
          className={S.headerButton}
          onClick={() => setIsSearch(true)}
        >
          <div>
            <img src={search} width={"34px"} alt="검색" />
          </div>
        </button>

        <button type="button" className={S.headerButton} onClick={handleMyPage}>
          <img src={profile} width={"42px"} alt="유저프로필" />
        </button>

        {isMobile ? null : isAuth ? (
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
    </div>
  );
}

export default Header;
