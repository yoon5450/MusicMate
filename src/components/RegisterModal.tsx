import { useEffect, useState, type FormEvent } from "react";
import { signIn, signOut, signUp } from "@/api/auth";
import supabase from "@/utils/supabase";
import S from "@/styles/_modal.module.css";
import { getGenres, type GenreType } from "@/api/genres";

interface Props {
  onClose: () => void;
}


// 에러메세지 
function getKoreanErrorMessage(message: string): string {
  if (message.includes("Anonymous sign-ins are disabled")) {
    return "이메일 또는 비밀번호를 입력해 주세요.";
  }
  if (message.includes("Signup requires a valid password")) {
    return "비밀번호를 입력해 주세요.";
  }
  if (message.includes("Password should be at least 6 characters")) {
    return "비밀번호는 6자리 이상이어야 합니다.";
  }
  if (message.includes("already registered")) {
    return "이미 가입된 이메일입니다.";
  }
  if (message.includes("For security purposes, you can only request this after")) {
    // n초 후 시도 하라는 메세지 출력하기
    const match = message.match(/after (\d+) second/);
    if (match) {
      const seconds = match[1];
      return `${seconds}초 후에 다시 시도해 주세요.`;
    }
  }

  return message;
}

export default function SignUp({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [genres, setGenres] = useState<GenreType[]>([]);


  useEffect(()=>{
    // 장르 목록 불러오기
    const fetchGenres = async () => {
      const data = await getGenres();
      if(data)
        setGenres(data);
    }
    fetchGenres();
  },[]);


  // 장르 토글
  const toggleGenre = (code: number) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const { data, error } = await signUp(email, password);

    if (error) {
      setErrorMessage(`회원가입 실패: ${getKoreanErrorMessage(error.message)}`);
      return;
    }

    // 선택된 장르가 있으면
    if (selectedGenres.length > 0) {
      // 유저의 장르 table 에 접근하기 위해 로그인
      const { error: loginError } = await signIn(email, password);

      if (loginError) return null;

      const inserts = selectedGenres.map((code) => ({
        user_id: data.user!.id,
        genre_code: code,
      }));

      const { error: insertError } = await supabase
        .from("user_genres")
        .insert(inserts);

      if (insertError) {
        setErrorMessage(`장르 저장 실패: ${insertError.message}`);
        return;
      }

      await signOut();
    }

    handleClose();
    alert("회원 가입이 완료되었습니다.");
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setSelectedGenres([]);
    setErrorMessage(null);
    onClose();
  };

   // 회원가입 모달 return
  return (
    <div className={S.modalBackdrop}>
      <div className={S.modalBox}>
        <button className={S.closeBtn} onClick={handleClose}>
          ✕
        </button>
        <h2 className={S.title}>회원가입</h2>
        <form className={S.form} onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={S.input}
            autoFocus
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={S.input}
          />
          <div className={S.genresWrap}>
            <div className={S.genresLabel}>선호 장르 선택</div>
            <div className={S.genreGrid}>
              {genres.map((genre) => (
                <button
                  key={genre.code}
                  type="button"
                  className={`${S.genreBtn} ${selectedGenres.includes(genre.code) ? S.active : ""}`}
                  onClick={() => toggleGenre(genre.code)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className={S.submitBtn}>
            회원가입
          </button>
        </form>
        {errorMessage && <div className={S.errorMsg}>{errorMessage}</div>}
      </div>
    </div>
  );
}
