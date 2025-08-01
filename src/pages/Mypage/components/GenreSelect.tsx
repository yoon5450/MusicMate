import { useEffect, useState } from "react";
import S from "../Mypage.module.css";
import { getGenres, type GenreType } from "@/api/genres";
import { updateUserGenres } from "@/api";
import { useUserGenre } from "@/context/UserGenreContext";

interface Props {
  user: { id: string; email: string };
}

function GenreSelect({ user }: Props) {
  const [previousGenres, setPreviousGenres] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  const { setIsGenreChanged, userGenre } = useUserGenre();

  useEffect(() => {
    // 장르 목록 불러오기
    const fetchGenres = async () => {
      const data = await getGenres();
      if (data) setGenres(data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    setPreviousGenres(userGenre);
    setSelectedGenres(userGenre);
  }, [userGenre]);

  useEffect(() => {
    const changed =
      selectedGenres.every((genre) => previousGenres.includes(genre)) &&
      previousGenres.every((genre) => selectedGenres.includes(genre));
    setIsChanged(!changed);
  }, [selectedGenres, previousGenres]);

  // 장르 토글
  const toggleGenre = (code: number) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleChangeGenre = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isChanged) return;
    const data = await updateUserGenres({
      selected_genres: selectedGenres,
      user_id: user.id,
    });
    console.log(data);
    if (!data) return;
    setIsChanged(false);
    setIsGenreChanged();
    alert("선호 장르가 변경되었습니다");
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
      <button
        type="button"
        className={isChanged ? `${S.changedSubmitBtn}` : `${S.submitBtn}`}
        onClick={handleChangeGenre}
      >
        수정하기
      </button>
    </div>
  );
}

export default GenreSelect;
