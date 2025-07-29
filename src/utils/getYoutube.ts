/**
 * 유튜브 썸네일 URL 생성 함수
 * id가 11자 패턴이면 HQ 썸네일 주소를 반환
 * 아니면 기본 이미지(FALLBACK_THUMB)를 반환
 * @param id youtube_id 
 * @returns 썸네일 URL 또는 Fallback 기본 이미지 
 */

const FALLBACK_THUMB = "/music_mate_symbol_fixed.svg";

export const getYoutubeThumbnail = (id:string):string =>{
  const idPattern = /^[\w-]{11}$/;  //정규식 길이 11 
   return idPattern.test(id)
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : FALLBACK_THUMB;
}

/**
 * 유튜브 영상 페이지 URL 생성
 *  @param id youtube_id 
 */
export const getYoutubeUrl = (id:string):string =>`https://youtu.be/${id}`;
