import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";


export type PlaylistType = Tables<"playlists">;

/**
 * 모든 플레이리스트를 가져온다.
 * @returns PlaylistType[] | null
 */
export const getPlaylists = async (): Promise<PlaylistType[] | null> => {
  const {data,error} = await supabase
  .from("playlists")
  .select("*");

  if(error){
    errorHandler(error,"getPlaylists");
    return null;
  }
  return data;
};