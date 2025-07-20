import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

/**
 * @description 채널 구분하지 않는 피드 전체 데이터를 받아옵니다. 테스트용으로 사용해보세요.
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export async function getAllFeeds(): Promise<Tables<"feeds">[] | null> {
  const { data, error } = await supabase.from("feeds").select();

  if (error) {
    errorHandler(error, "getAllFeeds");
    return null;
  } else {
    console.log(data);
    return data;
  }
}

/**
 * @description 유저 id에 기반한 모든 피드를 가져옵니다.
 * @param {string} uid
 * @returns {Promise<Tables<"feeds">[] | null>} feedData
 */
export const getUserFeeds = async (
  uid: string
): Promise<Tables<"feeds">[] | null> => {
  const { data, error } = await supabase
    .from("feeds")
    .select()
    .eq("author_id", uid);

  if (error) {
    errorHandler(error, "getUserFeeds");
    return null;
  } else {
    console.log(data);
    return data;
  }
};

/**
 * @description 유저의 채널에서 보낸 피드 목록을 가져옵니다.
 * @param {string} uid
 * @param {string} channel_id
 * @returns
 */
export const getUserChannelFeeds = async (uid: string, channel_id: string) => {
  const { data, error } = await supabase
    .from("feeds")
    .select()
    .eq("author_id", uid)
    .eq("channel_id", channel_id);

  if (error) {
    errorHandler(error, "getChannelUserFeeds");
    return null;
  } else {
    console.log(data);
    return data;
  }
};

// TODO : 2차로 검색하는 방식에서 Supabase의 View 생성이나 컨텍스트 생성
// 너무 기워넣었다... 구조 점검 할 것
// 그냥 안 되네. View 생성해야겠는데.
export const getByKeywordFeeds = async (keyword: string) => {
  // injection 방지
  const safeKeyword = keyword.replace(/[%_]/g, "\\$&"); // 와일드카드 escape

  const { data: feedMatchData, error } = await supabase
    .from("feeds")
    .select(
      `*,
      user_profile:author_id(
        nickname
      )
      `
    )
    .or(`title.ilike.%${safeKeyword}%, content.ilike.%${safeKeyword}%`);

  const { data: nicknameMatchData, error: nickNameError } = await supabase
    .from("feeds")
    .select(
      `*,
      user_profile:author_id(
        nickname
      )
      `
    )
    .filter("user_profile.nickname", "ilike", `%${safeKeyword}%`);

  if (error && nickNameError) {
    errorHandler(error, "getByKeywordFeeds");
    return null;
  } else {
    const merged = [...(feedMatchData ?? []), ...(nicknameMatchData ?? [])];

    const unique = Array.from(
      new Map(merged.map((item) => [item.id, item])).values()
    );

    console.log(unique);
    return unique;
  }
};
