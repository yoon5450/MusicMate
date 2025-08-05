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
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

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
    return data;
  }
};

/**
 * @description 키워드에 기반한 피드를 검색해 가져옵니다. [Option] 채널 안에서 조회 가능합니다.
 * @returns {Promise<Tables<"view_feed_search">[] | null>} feedData
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
      `title.ilike.*${safeKeyword}*, content.ilike.*${safeKeyword}*, nickname.ilike.*${safeKeyword}*`
    );

  if (channel_id) query = query.eq("channel_id", channel_id);

  const { data, error } = await query;

  if (error) {
    errorHandler(error, "getFeedsByKeyword");
    return null;
  } else {
    return data;
  }
};

/**
 * @description 지정한 채널의 지정한 시간보다 큰 feed를 20개 가져옵니다.
 * @param curChannelId
 * @param lastTime
 * @returns
 */
export const getFeedsByChannelAndBefore = async (
  curChannelId: string,
  lastTime: string
) => {
  // 반대 순서로 받아옴 limit은 가장 오래된 것을 잘라버림
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("channel_id", curChannelId)
    .lt("created_at", lastTime)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    errorHandler(error, "getFeedsByChannelAndBefore");
    return null;
  } else {
    return data.reverse();
  }
};

/**
 * @description 지정한 채널의 지정한 시간보다 나중에 나온 20개의 피드를 가져옵니다.
 * @param curChannelId
 * @param lastTime
 * @returns
 */
export const getFeedsByChannelAndAfter = async (
  curChannelId: string,
  lastTime: string
) => {
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("channel_id", curChannelId)
    .gt("created_at", lastTime)
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    errorHandler(error, "getFeedsByChannelAndAfter");
    return null;
  } else {
    return data;
  }
};

export const getFeedByTargetId = async (feedId: string) => {
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("feed_id", feedId);

  if (error) {
    errorHandler(error, "getFeedsByChannelAndNear");
    return null;
  } else {
    return data.reverse();
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
    return data;
  }
};

/**
 * @description 파일 객체 피드를 한번에 업로드합니다.
 *
 */
export const addFeedsWithFiles = async ({
  title,
  content,
  channel_id,
  message_type,
  audio_file,
  image_file,
}: InsertAllType) => {
  const { data: userData } = await supabase.auth.getUser();

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

  const { data, error: dbError } = await supabase.from("feeds").insert({
    title,
    content,
    audio_url,
    image_url,
    channel_id,
    message_type,
  }).select('*')

  // DB에 에러가 있으면 업로드 취소
  if (dbError) {
    pathArr.forEach((path) => {
      supabase.storage.from("feed-audio").remove([path]);
    });
    throw dbError;
  }

  return data?.[0] ?? null
};

/**
 * @description 파일을 업로드하고 해당 파일의 public url을 리턴합니다.
 * @param path
 * @param file
 * @param target
 * @returns publicUrl
 */
const uploadAndGetUrl = async (path: string, file: File, target: string) => {
  const [uploadResult, urlResult] = await Promise.all([
    supabase.storage.from(target).upload(path, file),
    supabase.storage.from(target).getPublicUrl(path),
  ]);

  if (uploadResult.error) throw uploadResult.error;

  return urlResult.data?.publicUrl;
};

/**
 * @description 인기 클립(message_type이 clip이고, audio_url이 있는 피드)
 * @returns 인기 클립 리스트
 */
export const getPopularClips = async (): Promise<
  Tables<"get_feeds_with_user_and_likes">[] | null
> => {
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("message_type", "clip")
    .not("audio_url", "is", null)
    .order("like_count", { ascending: false })
    .limit(10);

  if (error) {
    errorHandler(error, "getPopularClips");
    return null;
  }
  return data;
};

/**
 * @description 인기 피드(message_type이 default)
 * @returns 인기 피드 리스트
 */
export const getPopularFeeds = async (): Promise<
  Tables<"get_feeds_with_user_and_likes">[] | null
> => {
  const { data, error } = await supabase
    .from("get_feeds_with_user_and_likes")
    .select("*")
    .eq("message_type", "default")
    .order("like_count", { ascending: false })
    .limit(10);

  if (error) {
    errorHandler(error, "getPopularFeeds");
    return null;
  }
  return data;
};

export const deleteFeed = async (feedId: string) => {
  const { data, error } = await supabase.rpc("delete_feed", {
    p_feed_id: feedId,
  });

  if (error) {
    errorHandler(error, "deleteFeed");
    return null;
  }
  return data;
};
