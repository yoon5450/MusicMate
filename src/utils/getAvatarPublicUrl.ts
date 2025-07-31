/**
 * Supabase storage에 저장된 유저 프로필 이미지의 public URL을 반환
 * @param {string | null | undefined} path - Storage에 저장된 유저 이미지의 경로
 * @returns {string} 브라우저에서 접근 가능한 public URL. 경로가 없거나 잘못된 경우 기본 이미지 경로를 반환
 */


import supabase from '@/utils/supabase';


export function getAvatarPublicUrl(path:string | null | undefined):string{
  if(!path) return "/music_mate_symbol_fixed.svg";
  const{data} = supabase.storage
    .from("user-avatar")
    .getPublicUrl(path);
    return data?.publicUrl ?? "/music_mate_symbol_fixed.svg";
}