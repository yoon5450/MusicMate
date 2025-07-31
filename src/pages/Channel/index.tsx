import { useParams } from "@/router/RouterProvider";
import InputFeed from "./components/InputFeed";
import S from "./Channel.module.css";
import ChannelFeedMessage from "./components/ChannelFeedMessage";
import { useEffect, useState } from "react";
import { getFeedsWithAllByChannelId, getLikesByUserId } from "@/api";
import type { Tables } from "@/@types/database.types";
import { getAvatarUrlPreview } from "@/api/user_avatar";
import DetailFeeds from "./components/DetailFeeds";
import FeedReplies from "./components/FeedReplies";
import ChannelFeedAudio from "./components/ChannelFeedAudio";
import { useAuth } from "@/auth/AuthProvider";
import { handleToggleLike } from "@/utils/handleLikeToggle";
import { getRepliesWithUserInfo } from "@/api/replies";
import close from "@/assets/close.svg";
import { useUserProfile } from "@/context/UserProfileContext";
import { UserList } from "./components/UserList";

type FeedWithPreview = Tables<"get_feeds_with_user_and_likes"> & {
  preview_url?: string;
};

function Channel() {
  const { id } = useParams(); // 채널아이디
  const { user } = useAuth(); // 유저정보(id, 이메일)
  const { lastUpdatedAt } = useUserProfile();

  const [selectedFeed, setSelectedFeed] = useState<FeedWithPreview | null>(
    null
  );
  const [feedData, setFeedData] = useState<FeedWithPreview[] | null>(null);
  const [userLikes, setUserLikes] = useState<string[] | null>(null);
  const [repliesData, setRepliesData] = useState<
    Tables<"get_replies_with_user">[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      setSelectedFeed(null);

      const feeds = await getFeedsWithAllByChannelId(id);
      if (!feeds) return;

      const updatedFeeds = await Promise.all(
        feeds.map(async (feed) => {
          const previewUrl = await getPreviewImage(feed);
          return { ...feed, preview_url: previewUrl };
        })
      );

      setFeedData(updatedFeeds);

      // 유저가 있는 경우에만 userLikes 호출
      if (user) {
        const likes = await getLikesByUserId(user.id);
        setUserLikes(likes?.map((like) => like.feed_id) ?? []);
      }
    };

    fetchData();
  }, [id, user, lastUpdatedAt]);

  // 선택된피드 바뀔때마다 해당 피드의 댓글 가져오기
  useEffect(() => {
    if (!selectedFeed?.feed_id) return;
    const getReplies = async (feedId: string) => {
      const data = await getRepliesWithUserInfo(feedId);
      setRepliesData(data);
    };
    if (!selectedFeed.feed_id) return;
    getReplies(selectedFeed.feed_id);
  }, [selectedFeed]);

  // 유저아바타프리뷰 url 가져오기
  const getPreviewImage = async (
    feed: Tables<"get_feeds_with_user_and_likes">
  ): Promise<string | undefined> => {
    if (!feed.author_profile_url) return;

    const previewUrl = await getAvatarUrlPreview(feed.author_profile_url);
    if (!previewUrl) return;
    return previewUrl;
  };

  const onToggleLike = async (feedId: string) => {
    if (!user) return;
    const result = await handleToggleLike(user.id, feedId, userLikes, feedData);
    if (!result) return;
    const { newUserLikes, newFeedData } = result;
    setUserLikes(newUserLikes);
    setFeedData(newFeedData);

    if (selectedFeed?.feed_id === feedId && newFeedData) {
      const updatedFeed = newFeedData.find((f) => f.feed_id === feedId);
      if (updatedFeed) {
        setSelectedFeed(updatedFeed);
      }
    }
  };

  const renderFeedComponent = (feed: FeedWithPreview) => {
    if (!feed.feed_id) return;
    const commonProps = {
      feedItem: feed,
      isActive: selectedFeed?.feed_id === feed.feed_id,
      isUserLike: userLikes?.includes(feed.feed_id!) ?? false,
      onReplyClicked: () => setSelectedFeed(feed),
      onToggleLike: () => onToggleLike(feed.feed_id!),
    };

    if (feed.message_type === "clip")
      return <ChannelFeedAudio key={feed.feed_id} {...commonProps} />;
    return <ChannelFeedMessage key={feed.feed_id} {...commonProps} />;
  };

  return (
    <>
      <div className={S.contentContainer}>
        <div className={S.contentWrapper}>
          <div className={S.feedArea}>
            <ul className={S.contentArea}>
              {feedData?.map((data) => renderFeedComponent(data))}
            </ul>
            <div
              className={`${S.detailContentArea} ${selectedFeed ? S.open : ""}`}
            >
              {selectedFeed ? (
                <>
                  <DetailFeeds
                    feedItem={selectedFeed}
                    replies={repliesData?.length}
                    onToggleLike={onToggleLike}
                    isUserLike={
                      userLikes?.includes(selectedFeed.feed_id!) ?? false
                    }
                  />
                  <FeedReplies replies={repliesData} />
                  <button
                    type="button"
                    className={S.closeButton}
                    onClick={() => setSelectedFeed(null)}
                  >
                    <img src={close} alt="" />
                  </button>
                </>
              ) : null}
            </div>
            </div>
          <div>
            <InputFeed curChannelId={id} />
          </div>
        </div>
        <div className={S.userListArea}>
          <UserList channelId={id} />
        </div>
      </div>
    </>
  );
}

export default Channel;
