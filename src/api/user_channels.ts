import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

export type UserChannelsType = Tables<"user_channels">;

/**
 * @description 모든 유저의 가입한 채널을 조회합니다.
 * @returns {Promise<Tables<"user_channels">[] | null>} userChannels[]
 */
export const getUserChannels = async (): Promise<UserChannelsType[] | null> => {
  const { data, error } = await supabase.from("user_channels").select("*");

  if (error) {
    errorHandler(error, "getUserChannels");
    return null;
  } else {
    return data;
  }
};

/**
 *
 * @description 유저 id 기반한 가입한 채널을 조회합니다.
 * @returns
 */
export const getUserChannelsByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from("view_user_channels")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    errorHandler(error, "getUserChannelsByUserId");
    return null;
  } else {
    return data;
  }
};

/**
 * @description 파라미터에 주어진 channel_id에 가입합니다. 로그인한 userId로 자동 바인딩됩니다.
 */
export const addUserChannels = async (channel_id: string) => {
  const { error } = await supabase.from("user_channels").insert({ channel_id });

  if (error) {
    errorHandler(error, "addUserChannels");
  } else {
    console.log("성공");
  }
};
