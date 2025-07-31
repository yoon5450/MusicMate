import { getGenres, type GenreType } from "@/api/genres";
import { useEffect, useState } from "react";
import S from "../../Mypage/Mypage.module.css";
import { getUserPreferredGenreByUserId } from "@/api";


interface Props{
  userId : string;
}

function GenreSelectReadOnly({userId}:Props) {
  const [userGenres, setUserGenres] = useState<number[]>([]);
  const [genreList, setGenreList] = useState<GenreType[]>([]);

  useEffect(()=>{
    const fetchGenres = async()=>{
      const data = await getGenres();
      if(data) setGenreList(data);
    };
    fetchGenres();
  },[]);

  useEffect(()=>{
    const getUserGenres = async()=>{
      const data = await getUserPreferredGenreByUserId(userId);
      if(data) setUserGenres(data);
    };
    getUserGenres();
  },[userId]);

  const selectedGenres = genreList
    .filter((genre) => userGenres.includes(genre.code))    
    .map((genre) => genre.name);

  
return (
    <div className={S.genreContainer}>
      <h3>선호 장르</h3>
      <div className={S.genreGrid}>
        {selectedGenres.map((name) => (
          <span key={name} className={`${S.genreBtn} ${S.active}`}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
export default GenreSelectReadOnly

