import { useEffect, useState } from "react";
import S from "../Mypage.module.css";
import { getGenres, type GenreType } from "@/api/genres";
import { getUserPreferredGenre, updateUserGenres } from "@/api";

interface Props {
  user: { id: string; email: string };
}

function GenreSelect({ user }: Props) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<GenreType[]>([]);

  useEffect(() => {
    // 장르 목록 불러오기
    const fetchGenres = async () => {
      const data = await getGenres();
      if (data) setGenres(data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const getUserGenres = async () => {
      const data = await getUserPreferredGenre();
      if (!data) {
        setSelectedGenres([]);
        return;
      }
      setSelectedGenres(data);
      return;
    };
    getUserGenres();
  }, []);

  // 장르 토글
  const toggleGenre = (code: number) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleChangeGenre = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(selectedGenres);

    if (selectedGenres.length > 0) {
      const data = await updateUserGenres({
        selected_genres: selectedGenres,
        user_id: user.id,
      });
      console.log(data);
      if (!data) return;
    }
  };

  return (
    <div className={S.genreContainer}>
      <h3>선호 장르 수정</h3>
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
      <button type="button" className={S.submitBtn} onClick={handleChangeGenre}>
        수정하기
      </button>
    </div>
  );
}

export default GenreSelect;
