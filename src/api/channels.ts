import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

export type ChannelsType = Tables<"channels">;
type InsertType = {
  description?: string | undefined;
  genre_code?: number | undefined;
  name: string;
  owner_id: string;
};

/**
 * @description 모든 채널을 조회합니다.
 * @returns {Promise<ChannelsType[] | null>} channelData
 */
export const getChannels = async (): Promise<ChannelsType[] | null> => {
  const { data, error } = await supabase.from("channels").select("*");

  if (error) {
    errorHandler(error, "getChannels");
    return null;
  } else {
    return data;
  }
};

// RPC ( Remote Procedual Call )
// addChannels -> 채널도 생성하고, 채널을 생성한 인원이 이 채널에 포함되어야 함.
// channels, user_channels <- addChannels, addUserChannels 두 동작을 한번에 수행
// undefined로 처리
/**
 *
 * @description 유저가 채널을 생성합니다. 채널을 생성한 유저는 자동으로 그 채널의 소속이 됩니다.
 * @returns
 */
export const addChannels = async ({
  name,
  description,
  genre_code,
}: InsertType) => {
  const { data, error } = await supabase.rpc("create_channel_and_link_user", {
    name,
    description,
    genre_code,
  });

  if (error) {
    errorHandler(error, "addChannels");
    return null;
  } else {
    return data;
  }
};
