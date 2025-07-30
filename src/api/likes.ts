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

export const getLikesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("feed_id")
    .eq("user_id", userId);

  if (error) {
    errorHandler(error, "getLikesByUserId");
    return null;
  } else {
    return data;
  }
};

export const addLikeByUserIdAndFeedId = async (
  feedId: string,
  userId: string
) => {
  const { error } = await supabase
    .from("likes")
    .insert([{ feed_id: feedId, user_id: userId }]);
  if (error) {
    console.log(error.message);
    errorHandler(error, "addLikeByUserIdAndFeedId");
    return null;
  } else return true;
};

export const removeLikeByUserIdAndFeedId = async (
  feedId: string,
  userId: string
) => {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("feed_id", feedId)
    .eq("user_id", userId);
  if (error) {
    console.log(error.message);
    errorHandler(error, "removeLikeByUserIdAndFeedId");
    return null;
  } else return true;
};
