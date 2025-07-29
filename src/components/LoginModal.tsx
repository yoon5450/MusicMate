import { signIn } from "@/api/auth";
import { useLoginModal } from "@/context/LoginModalContext";
import S from "@/styles/_modal.module.css";
import { useState } from "react";
import RegisterModal from "./RegisterModal";

// 에러메세지
function getKoreanErrorMessage(message: string): string {
  switch (message) {
    case "Invalid login credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "missing email or phone":
      return "이메일 또는 전화번호를 입력해 주세요.";
    default:
      return message;
  }
}

function LoginModal() {
  const { open, closeLogin } = useLoginModal();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleClose = () => {
    setId("");
    setPw("");
    setError("");
    closeLogin();
  };

  if (!open && !registerOpen) return null;

  // api 요청
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await signIn(id, pw);

    if (error) {
      // 로그인 실패
      setError(getKoreanErrorMessage(error.message));
    } else {
      // 로그인 성공
      handleClose();
      alert('로그인에 성공하였습니다!')
    }
  };

  // 회원가입 모달 열기
  const handleOpenRegister = () => {
    handleClose();
    setRegisterOpen(true);
  };

  // 회원가입 모달 닫기
  const handleCloseRegister = () => {
    setRegisterOpen(false);
  };

  // true 일때 회원가입 모달 return
  if (registerOpen) {
    return <RegisterModal onClose={handleCloseRegister} />;
  }

  // 로그인 모달 return
  return (
    <div className={S.modalBackdrop}>
      <div className={S.modalBox}>
        <button className={S.closeBtn} onClick={handleClose}>
          ✕
        </button>
        <h2 className={S.title}>Sign in</h2>
        <form className={S.form} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={S.input}
            autoFocus
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className={S.input}
          />
          <button type="submit" className={S.submitBtn}>
            로그인
          </button>
        </form>
        <p
          className={S.bottomText}
          onClick={() => {
            handleOpenRegister();
          }}
        >
          아직 회원이 아니신가요?
        </p>
        {error && <div className={S.errorMsg}>{error}</div>}
      </div>
    </div>
  );
}

export default LoginModal;
