import type { UserGenreDetail } from "@/api/user_genres";
import { useEffect, useState } from "react";
import S from "../../Mypage/Mypage.module.css";
import { getUserProfilePageGenres } from "@/api";

interface Props{
  userId : string;
}

function GenreSelectReadOnly({userId}:Props) {
  const [userGenres, setUserGenres] = useState<UserGenreDetail[]>([]);

  useEffect(()=>{
    const getUserGenres = async()=>{
      const data = await getUserProfilePageGenres(userId);
      if(data) setUserGenres(data);
    };
    getUserGenres();
  },[userId]);

  
  return (
    <div className={S.genreContainer}>
      <h3>선호 장르</h3>
      <div className={S.genreGrid}>
        {userGenres.map((genre) => (
          <span key={genre.genre_code} className={`${S.genreBtn} ${S.active}`}>
            {genre.genre_name}
          </span>
        ))}
      </div>
    </div>
  );
}
export default GenreSelectReadOnly
