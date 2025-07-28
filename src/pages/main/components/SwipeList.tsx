import { Swiper,SwiperSlide } from "swiper/react";
import S from "./style.SwiperList.module.css"
import 'swiper/css';
import 'swiper/css/navigation';
import {playlistData} from '@/data/playlistData';
import { useMemo } from "react";
import { Navigation } from "swiper/modules";


function shuffleArray<T>(array:T[]):T[]{
  return [...array].sort(() => Math.random() - 0.5);
}

function SwipeList() {

  const shuffledPlaylistData = useMemo(()=> shuffleArray(playlistData),[]);

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
        {shuffledPlaylistData.map((item)=>(
          <SwiperSlide key={item.id} className={S.swiperSlide}>
            <a 
              href={item.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className={S.card}
            >
              <img 
              src={item.thumbnailUrl}
              alt={item.title}
              className={S.image}
             />
             <p className={S.cardTitle}>{item.title}</p>
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