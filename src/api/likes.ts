import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

/**
 * @description Feed ID 기준 좋아요 데이터를 조회합니다.
 * @returns {Promise<Tables<"user_profile">[] | null>} targetUserProfileData
 */

// TODO : COUNTER 작업만 하면 될 것 같은데 length로 할지 counter(*)로 작업할지 고민
export const getLikesByFeedId = async (feedId: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select()
    .eq("feed_id", feedId);

  if (error) {
    errorHandler(error, "getLikesByFeedId");
    return null;
  } else {
    return data;
  }
};
