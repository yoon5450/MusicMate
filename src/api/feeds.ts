import type { Database, Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

type InsertType = {
  audio_url: string | null;
  channel_id: string;
  content: string | null;
  image_url: string | null;
  message_type: Database["public"]["Enums"]["message_type"];
  title: string | null;
};

/**
 * @description 채널 구분하지 않는 피드 전체 데이터를 받아옵니다. 테스트용으로 사용해보세요.
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export async function getFeeds(): Promise<Tables<"feeds">[] | null> {
  const { data, error } = await supabase.from("feeds").select();

  if (error) {
    errorHandler(error, "getFeeds");
    return null;
  } else {
    return data;
  }
}

/**
 * @description 모든 데이터가 조인된 상태로 받아옵니다.
 * @returns AllFkJoindData
 */
export const getFeedsWithAll = async () => {
  const { data, error } = await supabase
    .from("view_feed_with_user")
    .select("*");

  if (error) {
    errorHandler(error, "getFeedsWithLikesCount");
    return null;
  } else {
    return data;
  }
};

/**
 * @description 유저 id에 기반한 모든 피드를 가져옵니다.
 * @param {string} uid
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export const getFeedsByUserId = async (
  uid: string
): Promise<Tables<"feeds">[] | null> => {
  const { data, error } = await supabase
    .from("feeds")
    .select()
    .eq("author_id", uid);

  if (error) {
    errorHandler(error, "getFeedsByUserId");
    return null;
  } else {
    return data;
  }
};

/**
 * @description 유저의 채널에서 보낸 피드 목록을 가져옵니다.
 * @param {string} uid
 * @param {string} channel_id
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export const getFeedsByUserInChannel = async (
  uid: string,
  channel_id: string
) => {
  const { data, error } = await supabase
    .from("feeds")
    .select()
    .eq("author_id", uid)
    .eq("channel_id", channel_id);

  if (error) {
    errorHandler(error, "getFeedsByUserInChannel");
    return null;
  } else {
    console.log(data);
    return data;
  }
};

/**
 * @description 키워드에 기반한 피드를 검색해 가져옵니다. [Option] 채널 안에서 조회 가능합니다.
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export const getFeedsByKeyword = async (
  keyword: string,
  channel_id?: string
): Promise<Tables<"view_feed_search">[] | null> => {
  // injection 방지
  const safeKeyword = keyword.replace(/[%_]/g, "\\$&"); // 와일드카드 escape

  let query = supabase
    .from("view_feed_search")
    .select("*")
    .or(
      `title.ilike.%${safeKeyword}, content.ilike.%${safeKeyword}, nickname.ilike.%${safeKeyword}%`
    );

  if(channel_id) query = query.eq("channel_id", channel_id)

  const { data, error } = await query

  if (error) {
    errorHandler(error, "getFeedsByKeyword");
    return null;
  } else {
    console.log(data);
    return data;
  }
};

/**
 * @description 대댓글과 댓글 모두 불러오기
 */

/**
 * @description 유저가 피드를 작성한 경우 피드데이터를 추가합니다
 */
export const addFeeds = async ({
  audio_url,
  channel_id,
  content,
  image_url,
  message_type,
  title,
}: InsertType) => {
  const { data, error } = await supabase
    .from("feeds")
    .insert({
      audio_url,
      channel_id,
      content,
      image_url,
      message_type,
      title,
    })
    .select();

  if (error) {
    errorHandler(error, "addChannelMessages");
    return null;
  } else {
    console.log(data);
    return data;
  }
};
