import { signIn } from "@/api/auth";
import { useLoginModal } from "@/context/LoginModalContext";
import S from "@/styles/_loginModal.module.css";
import { useState } from "react";

function LoginModal() {
  const { open, closeLogin } = useLoginModal();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await signIn(id, pw);
    if (error) {
      // 로그인 실패
      console.log(error);
      setError(error.message);
    } else {
      // 로그인 성공
      console.log(data);
      closeLogin();
    }
  };

  return (
    <div className={S.modalBackdrop}>
      <div className={S.modalBox}>
        <button className={S.closeBtn} onClick={closeLogin}>
          ✕
        </button>
        <div className={S.logoWrap}>{/* 로고 넣기 */}</div>
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
        <p className={S.bottomText}>
          {/* 로그인 모달 닫고 회원가입 모달 열리기 */}
          아직 회원이 아니신가요?
        </p>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

export default LoginModal;
