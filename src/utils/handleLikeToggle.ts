import type { Tables } from "@/@types/database.types";
import { addLikeByUserIdAndFeedId, removeLikeByUserIdAndFeedId } from "@/api";

export const handleToggleLike = async (
  userId: string,
  feedId: string,
  userLikes: string[] | null,
  feedData: Tables<"get_feeds_with_user_and_likes">[] | null
) => {
  if (!userId) return;
  const alreadyLiked = userLikes?.includes(feedId);
  const success = alreadyLiked
    ? await removeLikeByUserIdAndFeedId(feedId, userId)
    : await addLikeByUserIdAndFeedId(feedId, userId);

  if (!success) return;

  const newUserLikes = alreadyLiked
    ? (userLikes ?? []).filter((likeId) => likeId !== feedId)
    : [...(userLikes ?? []), feedId];

  const newFeedData =
    feedData?.map((feed) => {
      if (feed.feed_id !== feedId) return feed;
      return {
        ...feed,
        like_count: feed.like_count! + (alreadyLiked ? -1 : 1),
      };
    }) ?? null;

  return { newUserLikes, newFeedData };
};
