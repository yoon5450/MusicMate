import type { Tables } from "@/@types/database.types";


type NewFeedInput = {
  id: string;
  author_id: string;
  channel_id: string;
  content: string | null;
  created_at: string;
  image_url: string | null;
  audio_url: string | null;
  title: string | null;
  message_type: "default" | "clip" | "image";
};

type FeedWithPreview = Tables<"get_feeds_with_user_and_likes"> & {
  preview_url?: string;
};

export const convertNewFeedToFeedData = (
  newFeed: NewFeedInput,
  nickname: string | null,
  profileUrl: string | null
): FeedWithPreview => {
  return {
    audio_url: newFeed.audio_url,
    author_id: newFeed.author_id,
    author_nickname: nickname,
    author_profile_url: profileUrl,
    channel_id: newFeed.channel_id,
    content: newFeed.content,
    created_at: newFeed.created_at,
    feed_id: newFeed.id,
    image_url: newFeed.image_url,
    like_count: 0,
    message_type: newFeed.message_type,
    title: newFeed.title,
    preview_url: profileUrl ? profileUrl : undefined, // 있을 경우에만
  };
};