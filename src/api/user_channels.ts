import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

export type UserChannelsType = Tables<"user_channels">

/**
 * @description 모든 유저의 가입한 채널을 조회합니다.
 * @returns {Promise<Tables<"user_channels">[] | null>} userChannels[] 
 */
export const getUserChannels = async ():Promise<UserChannelsType[] | null> => {
  const { data, error } = await supabase
    .from("user_channels")
    .select("*")


  if (error) {
    errorHandler(error, "getUserChannels");
    return null;
  } else {
    return data;
  }
};

//TODO: 유저 닉네임 기반한 채널 조회
// Channel 이름 데이터 등도 가져와야 할 것 같아서 view 생성