import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

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
 * @returns
 */
export const getFeedsByUserInChannel = async (uid: string, channel_id: string) => {
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

// View를 이용해 구현완
export const getFeedsByKeyword = async (keyword: string):Promise<Tables<"view_feed_search">[] | null> => {
  // injection 방지
  const safeKeyword = keyword.replace(/[%_]/g, "\\$&"); // 와일드카드 escape

  const {data, error} = await supabase
  .from("view_feed_search")
  .select("*")
  .or(
    `title.ilike.%${safeKeyword}, content.ilike.%${safeKeyword}, nickname.ilike.%${safeKeyword}%`
  )

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