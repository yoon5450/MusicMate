import type { Tables } from "@/@types/database.types";
import errorHandler from "@/error/supabaseErrorHandler";
import supabase from "@/utils/supabase";

/**
 * @description 피드아이디와 일치하는 피드의 댓글을 모두 불러옵니다.
 * @param {string} feedId
 * @returns  {Promise<Tables<"feed_replies">[]|null>} feed reply 배열
 */
export const getRepliesByFeedId = async (
  feedId: string
): Promise<Tables<"feed_replies">[] | null> => {
  const { data, error } = await supabase
    .from("feed_replies")
    .select("*")
    .eq("feed_id", feedId);

  if (error) {
    errorHandler(error, "getRepliesByFeedId");
    return null;
  } else {
    return data;
  }
};

export const getRepliesWithUserInfo = async (
  feedId: string
): Promise<Tables<"get_replies_with_user">[] | null> => {
  const { data, error } = await supabase
    .from("get_replies_with_user")
    .select("*")
    .eq("feed_id", feedId);

  if (error) {
    errorHandler(error, "getRepliesWithUserInfo");
    return null;
  } else {
    return data;
  }
};

export const addReply = async ({
  content,
  feed_id,
}: {
  content: string;
  feed_id: string;
}) => {
  const { data, error } = await supabase
    .from("feed_replies")
    .insert({
      content,
      feed_id,
    })
    .select();

  if (error) {
    errorHandler(error, "addReply");
    return null;
  } else {
    return data;
  }
};
