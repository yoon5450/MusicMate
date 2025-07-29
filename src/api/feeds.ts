import type { Database, Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

type MessageEnum = Database["public"]["Enums"]["message_type"];

type InsertType = {
  audio_url: string | null;
  channel_id: string;
  content: string | null;
  image_url: string | null;
  message_type: MessageEnum;
  title: string | null;
};

type InsertAllType = {
  title?: string;
  content?: string;
  channel_id: string;
  message_type: MessageEnum;
  audio_file?: File | null;
  image_file?: File | null;
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
 * @description 해당채널에 있는 모든 피드 데이터가 조인된 상태로 받아와집니다.
 * @returns AllFkJoindData
 */
export const getFeedsWithAllByChannelId = async (channelId: string) => {
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("channel_id", channelId);

  if (error) {
    errorHandler(error, "getFeedsWithAllByChannelId");
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

  if (channel_id) query = query.eq("channel_id", channel_id);

  const { data, error } = await query;

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

// 녹음이 없으면 아예 실행되지 않음.
// 아 이쁘게 짠거같은데.
export const addFeedsWithFiles = async ({
  title,
  content,
  channel_id,
  message_type,
  audio_file,
  image_file,
}: InsertAllType) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData) alert("로그인 후에 글을 올릴 수 있습니다.");

  const pathArr = [];
  const now = Date.now();
  const path = `${userData.user?.id}.feed-${now}`;
  let image_url = undefined;
  let audio_url = undefined;

  if (image_file) {
    const ext = image_file.name.split(".").pop();
    const image_path = `${path}.${ext}`;
    pathArr.push(image_path);
    image_url = await uploadAndGetUrl(image_path, image_file, "feed-images");
  }

  if (audio_file) {
    const ext = audio_file.name.split(".").pop();
    const audio_path = `${path}.${ext}`;
    pathArr.push(audio_path);
    audio_url = await uploadAndGetUrl(audio_path, audio_file, "feed-audio");
  }

  const { error: dbError } = await supabase.from("feeds").insert({
    title,
    content,
    audio_url,
    image_url,
    channel_id,
    message_type,
  });

  if (dbError) {
    // Optional: Rollback storage upload if DB insert fails
    pathArr.forEach((path) => {
      supabase.storage.from("feed-audio").remove([path]);
    });
    throw dbError;
  }
};

const uploadAndGetUrl = async (path: string, file: File, target: string) => {
  const [uploadResult, urlResult] = await Promise.all([
    supabase.storage.from(target).upload(path, file),
    supabase.storage.from(target).getPublicUrl(path),
  ]);

  if (uploadResult.error) throw uploadResult.error;

  return urlResult.data?.publicUrl;
};
