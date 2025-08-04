/**
 * 인기 클립들을 보여주고, 각 썸네일을 클릭 시 오디오 플레이어와 채널 이동 버튼이 팝업됩니다.
 */

import { useEffect, useState } from 'react';
import { Swiper,SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import type { Tables } from '@/@types/database.types';
import S from './style.ClipSwiper.module.css';
import { getPopularClips } from '@/api';
import UserProfileLink from '@/components/common/Link/UserProfileLink';
import { getAvatarPublicUrl } from '@/utils/getAvatarPublicUrl';
import CustomAudioPlayer from '@/components/CustomAudioPlayer';
import ChannelLink from '@/components/common/Link/ChannelLink';



function ClipSwiper() {
  const [clips,setClips] = useState<Tables<"get_feeds_with_user_and_likes">[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<
    {url:string; 
    channel_id:string; 
    feed_id:string} | null>(null);


  useEffect(()=>{
    const fetchClips = async()=>{
      const data = await getPopularClips();
      if(data) setClips(data);
    };
    fetchClips();
  },[]);

  useEffect(()=>{
    const handlekeyDown = (e:KeyboardEvent) => {
      if(e.key === "Escape"){
        setSelectedAudio(null);
      }
    };

    if(selectedAudio){
      document.addEventListener("keydown",handlekeyDown);
    }
    return () => {
      document.removeEventListener("keydown",handlekeyDown);
    };
  },[selectedAudio]);


  return (
    <>
    <h2 className={S.title}>인기 클립</h2>
    <div className={S.swiperContainer}>
      <Swiper
        spaceBetween={12}
        slidesPerView={6}
        navigation
        modules={[Navigation]}
        className={S.swiper}
      >
        {clips?.map(({feed_id,title,image_url,audio_url,author_id,author_nickname,author_profile_url,channel_id})=>(
          <SwiperSlide key={feed_id} className={S.swiperSlide}>
            
            <div className={S.clipCard}>
              <img 
                src={image_url ?? "/music_mate_symbol_fixed.svg"} 
                alt={title ?? "thumbnail"} 
                className={S.thumbnail} 
                title="오디오 클립 듣기"
                role="button"
                tabIndex={0}
                aria-label={`${title ?? "클립"}재생`}
                onClick={()=>{
                  if(audio_url && channel_id && feed_id){
                    setSelectedAudio({
                      url:audio_url,
                      channel_id,
                      feed_id
                    });
                  }
                }}
                onKeyDown={(e)=>{
                  if(e.key === "Enter"){
                    if(audio_url && channel_id && feed_id){
                      setSelectedAudio({
                        url:audio_url,
                        channel_id,
                        feed_id
                      });
                    }
                  }
                }}
              />

              <h3 className={S.clipTitle}>{title}</h3>

              <UserProfileLink 
                userId={author_id!} 
                nickname={author_nickname ?? ""} 
                profileUrl={getAvatarPublicUrl(author_profile_url)} 
              >
              </UserProfileLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>


    {selectedAudio && (
      <div className={S.audioPopup} onClick={(e) => e.stopPropagation()}>
        <button 
          className={S.closeButton} 
          onClick={()=> setSelectedAudio(null)}
          >X</button>
        <CustomAudioPlayer playerType="mini"recordingData={selectedAudio} />

        <div className={S.gotoChannelWrapper}>
          <ChannelLink channelId={selectedAudio.channel_id} feedId={selectedAudio.feed_id}>
            <button className={S.gotoChannelButton}>채널로 이동</button>
          </ChannelLink>
        </div>
        </div>

    )}
    </>
  )
}
export default ClipSwiper