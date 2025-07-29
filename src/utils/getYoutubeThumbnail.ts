/**
 * @description 유튜브 썸네일 이미지 추출 함수입니다.
 */

export function getYoutubeThumbnail(url: string): string {
  try{
    const parsedUrl = new URL(url);
    let videoId : string | null = null;

    if(parsedUrl.hostname === "youtu.be"){
      videoId = parsedUrl.pathname.slice(1);
    }else if(parsedUrl.hostname.includes("youtube.com")){
      videoId = parsedUrl.searchParams.get("v");
    }

    if(!videoId) throw new Error("Invalid YouTube URL");

    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }catch(error){
    console.error(`썸네일 추출 실패 (URL: ${url}):`, error);
    return "/music_mate_symbol_fixed.svg";
  }
}