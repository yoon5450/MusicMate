import { Swiper,SwiperSlide } from "swiper/react";
import S from "./style.SwiperList.module.css"
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useMemo, useState } from "react";
import { Navigation } from "swiper/modules";
import { getPlaylists, type PlaylistType } from "@/api/playlists";
import { getYoutubeThumbnail, getYoutubeUrl} from "@/utils/getYoutube";

//플레이리스트 랜덤으로 보여주는 함수 
function shuffleArray<T>(array:T[]):T[]{
  return [...array].sort(() => Math.random() - 0.5);
}

function SwipeList() {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  const shuffledPlaylists = useMemo(()=> shuffleArray(playlists),[playlists]); 

  useEffect(() => {
    (async () => {
      const data = await getPlaylists();
      if(data) setPlaylists(data);
    })();
  },[]);

  return (
    <>
    <h2 className={S.title}>추천 플레이리스트</h2>
    <div className={S.content} >
      <div className={S.swiperContainer}>
        <Swiper
        spaceBetween= {12}
        slidesPerView= {4}
        navigation
        modules={[Navigation]}
        className={S.swiper}
        >
        {shuffledPlaylists.map(({ id, youtube_id, title })=>(
          <SwiperSlide key={id} className={S.swiperSlide}>
            <a 
              href={getYoutubeUrl(youtube_id)}
              target="_blank"
              rel="noopener noreferrer" 
              className={S.card}
            >
              <img 
              src={getYoutubeThumbnail(youtube_id)}
              alt={title}
              className={S.image}
             />
             <p className={S.cardTitle}>{title}</p>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </div>
    </>
  )
}

export default SwipeList