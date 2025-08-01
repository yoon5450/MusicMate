import { useParams } from "@/router/RouterProvider";
import InputFeed from "./components/InputFeed";
import S from "./Channel.module.css";
import ChannelFeedMessage from "./components/ChannelFeedMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkUserInChannels,
  getChannelInfoById,
  getFeedsWithAllByChannelId,
  getLikesByUserId,
    getFeedsByChannelAndAfter,
} from "@/api";
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
import InputReplies from "./components/InputReplies";
import { alert } from "@/components/common/CustomAlert";

type FeedWithPreview = Tables<"get_feeds_with_user_and_likes"> & {
  preview_url?: string;
};

type channelInfoType = {
  name: string;
  description: string | null;
};

function Channel() {
  const { id, feedId: paramsFeedId } = useParams(); // 채널아이디
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
  const [updateReplies, setUpdateReplies] = useState<number>(Date.now);
  const [isMember, setIsMember] = useState<boolean | null>(false);
  const feedRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const feedContainerRef = useRef<HTMLUListElement>(null);

  const [channelInfo, setChannelInfo] = useState<channelInfoType>();

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

  useEffect(() => {
    async function check() {
      if (id && user) {
        const flag = await checkUserInChannels(id, user?.id);
        setIsMember(flag);
      }
    }
    check();
    console.log(isMember);
  }, [id, user]);

  useEffect(() => {
    const getChannelInfo = async () => {
      const data = await getChannelInfoById(id);
      if (!data) return;
      setChannelInfo(data[0]);
    };
    getChannelInfo();
  }, [id]);

  // 선택된피드 바뀔때마다 해당 피드의 댓글 가져오기
  useEffect(() => {
    if (!selectedFeed?.feed_id) return;

    const getReplies = async (feedId: string) => {
      const data = await getRepliesWithUserInfo(feedId);
      setRepliesData(data);
    };
    if (!selectedFeed.feed_id) return;
    getReplies(selectedFeed.feed_id);
  }, [selectedFeed, updateReplies]);

  // Params에 feedId가 들어오면 자동으로 선택하기
  useEffect(() => {
    // 선택된 피드가 없을 때만 스크롤
    if(!paramsFeedId) scrollToBottom();
    if (feedData && paramsFeedId) {
      const updatedFeed = feedData.find((f) => f.feed_id === paramsFeedId);
      console.log(paramsFeedId);
      setSelectedFeed(updatedFeed ?? null);
    }
  }, [paramsFeedId, feedData]);
  // 선택된 피드 바뀔때마다 스크롤이동하기
  useEffect(() => {
    if (!selectedFeed?.feed_id) return;
    scrollToSelectedFeed();
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

  const onToggleLike = useCallback(
    async (feedId: string) => {
      if (!user) {
        alert("피드에 좋아요를 누르려면 로그인해야 합니다.");
        return;
      }
      if (!isMember) {
        alert("피드에 좋아요를 누르려면 멤버여야 합니다.");
        return;
      }
      const result = await handleToggleLike(
        user.id,
        feedId,
        userLikes,
        feedData
      );
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
    },
    [user, userLikes, feedData, selectedFeed]
  );

  const renderFeedComponent = useCallback(
    (feed: FeedWithPreview) => {
      if (!feed.feed_id) return;
      const commonProps = {
        feedItem: feed,
        isActive: selectedFeed?.feed_id === feed.feed_id,
        isUserLike: userLikes?.includes(feed.feed_id!) ?? false,
        onReplyClicked: () => setSelectedFeed(feed),
        onToggleLike: () => onToggleLike(feed.feed_id!),
      };

      if (feed.message_type === "clip")
        return (
          <li
            key={feed.feed_id}
            id={feed.feed_id}
            ref={(el) => {
              if (el) feedRefs.current[feed.feed_id!] = el;
            }}
          >
            <ChannelFeedAudio {...commonProps} />
          </li>
        );
      return (
        <li
          key={feed.feed_id}
          id={feed.feed_id}
          ref={(el) => {
            if (el) feedRefs.current[feed.feed_id!] = el;
          }}
        >
          <ChannelFeedMessage {...commonProps} />
        </li>
      );
    },
    [selectedFeed, userLikes, onToggleLike]
  );

  const scrollToSelectedFeed = () => {
    if (selectedFeed?.feed_id) {
      const feed = feedRefs.current[selectedFeed.feed_id];
      const feedContainer = feedContainerRef.current;
      if (feed && feedContainer) {
        const feedRect = feed.getBoundingClientRect();
        const feedContainerRect = feedContainer.getBoundingClientRect();
        const offset =
          feedContainer.scrollTop + (feedRect.top - feedContainerRect.top - 12);
        feedContainer.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  };


  // 마지막 요소에서 20개를 더 로드
  // TODO : 상태기반으로 변경해서 옵저빙(IntersectionObserver) 추가
  const renderTailFeeds = useCallback(async () => {
    if (!feedData) return;
    const lastTime = feedData[feedData.length - 1].created_at;
    const afterFeedData = await getFeedsByChannelAndAfter(id, lastTime!);

    if (!afterFeedData) return;

    const updatedFeeds = await Promise.all(
      afterFeedData.map(async (feed) => {
        const previewUrl = await getPreviewImage(feed);
        return { ...feed, preview_url: previewUrl };
      })
    );

    setFeedData((prev) => [...(prev ?? []), ...(updatedFeeds ?? [])]);
  }, [feedData, id]);

  const scrollToBottom = useCallback(() => {
    const el = feedContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <>
      <div className={S.contentContainer}>
        <div className={S.contentWrapper}>
          <div className={S.channelInfo}>
            {channelInfo ? (
              <>
                <h3>{channelInfo.name}</h3>
                <p>{channelInfo.description}</p>
              </>
            ) : (
              <p>채널정보를 가져올 수 없습니다</p>
            )}
          </div>
          <div className={S.feedArea}>
            <ul className={S.contentArea} ref={feedContainerRef}>
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
                    scrollToSelectedFeed={scrollToSelectedFeed}
                  />
                  <FeedReplies replies={repliesData} />
                  <InputReplies
                    currentFeedId={selectedFeed.feed_id!}
                    setUpdateReplies={setUpdateReplies}
                  />
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

          <div
            className={`${S.inputFeedContainer} ${selectedFeed ? S.hide : ""}`}
          >
            <InputFeed curChannelId={id} renderTailFeeds={renderTailFeeds} scrollToBottom={scrollToBottom} />
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
