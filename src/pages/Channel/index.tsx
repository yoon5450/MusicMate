import { useParams } from "@/router/RouterProvider";
import InputFeed from "./components/InputFeed";
import S from "./Channel.module.css";
import ChannelFeedMessage from "./components/ChannelFeedMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkUserInChannels,
  getChannelInfoById,
  getLikesByUserId,
  getFeedsByChannelAndAfter,
  getFeedsByChannelAndBefore,
  getFeedByTargetId,
  deleteFeed,
  getChannelCreateUser,
  addUserInChannels,
  deleteUserInChannels,
  deleteChannel,
} from "@/api";
import type { Tables } from "@/@types/database.types";
import DetailFeeds from "./components/DetailFeeds";
import FeedReplies from "./components/FeedReplies";
import ChannelFeedAudio from "./components/ChannelFeedAudio";
import { useAuth } from "@/auth/AuthProvider";
import { handleToggleLike } from "@/utils/handleLikeToggle";
import { deleteReply, getRepliesWithUserInfo } from "@/api/replies";
import close from "@/assets/close.svg";
import { useUserProfile } from "@/context/UserProfileContext";
import { UserList } from "./components/UserList";
import InputReplies from "./components/InputReplies";
import {
  alert,
  confirmAlert,
  showToast,
} from "@/components/common/CustomAlert";
import { convertNewFeedToFeedData } from "@/utils/convertFeedToFeedData";
import supabase from "@/utils/supabase";
import { useChannel } from "@/context/ChannelContext";
import NoChannel from "../NotFound/NoChannel";
import { profileBucketUrl } from "@/constant/supabase.urls";
import { useMediaQuery } from "@/hook/useMediaQuery";

type FeedWithPreview = Tables<"get_feeds_with_user_and_likes"> & {
  preview_url?: string;
};

type channelInfoType = {
  name: string;
  description: string | null;
};

function Channel() {
  const { id, feedId: paramsFeedId = null } = useParams(); // 채널아이디
  const { user } = useAuth(); // 유저정보(id, 이메일)
  const { lastUpdatedAt, userProfile } = useUserProfile();
  const { setIsChannelChanged } = useChannel();

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
  const [isCreateMember, setIsCreateMember] = useState<boolean | null>(false);
  const [channelInfo, setChannelInfo] = useState<channelInfoType>();
  const [hasMoreTailFeeds, setHasMoreTailFeeds] = useState(true);
  const [hasMoreHeadFeeds, setHasMoreHeadFeeds] = useState(true);
  const [isTopFetching, setIsTopFetching] = useState<boolean>(false);
  const [isBottomFetching, setIsBottomFetching] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [noChannel, setNochannel] = useState(false);

  const feedRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const feedContainerRef = useRef<HTMLUListElement>(null);
  const replyContainerRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<IntersectionObserver | null>(null);
  const bottomObserverRef = useRef<IntersectionObserver | null>(null);
  const feedDataRef = useRef(feedData);

  const isMobile = useMediaQuery("(max-width:768px)");

  // Callback
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
    [user, isMember, userLikes, feedData, selectedFeed]
  );

  useEffect(() => {
    console.log("isAtBottom 상태:", isAtBottom);
  }, [isAtBottom]);

  useEffect(() => {
    setNochannel(false);
  }, [id]);

  const renderFeedComponent = useCallback(
    (feed: FeedWithPreview) => {
      if (!feed.feed_id) return;
      const commonProps = {
        feedItem: feed,
        isActive: selectedFeed?.feed_id === feed.feed_id,
        isUserLike: userLikes?.includes(feed.feed_id!) ?? false,
        onReplyClicked: () => setSelectedFeed(feed),
        onToggleLike: () => onToggleLike(feed.feed_id!),
        handleDelete: handleDelete,
        scrollForDropdown: scrollForDropdown,
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

  const scrollForDropdown = (
    open: boolean,
    dropdownRef: React.RefObject<HTMLUListElement | null>
  ) => {
    if (open && dropdownRef.current && feedContainerRef.current) {
      const dropdownEl = dropdownRef.current;
      const containerEl = feedContainerRef.current;

      const dropdownRect = dropdownEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      const isDropdownVisible =
        dropdownRect.bottom <= containerRect.bottom &&
        dropdownRect.top >= containerRect.top;

      if (!isDropdownVisible) {
        const offset = dropdownRect.top - containerRect.top - 12;
        if (containerEl.scrollTop > 0) {
          containerEl.scrollBy({ top: offset, behavior: "smooth" });
        } else if (dropdownRect.top < containerRect.top) {
          dropdownEl.style.top = "40px"; // fallback 위치 조정
        }
      }
    }
  };

  const handleChannelJoin = () => {
    if (!isMember) {
      if (channelInfo)
        confirmAlert(`${channelInfo.name} 채널에 가입하시겠습니까?`).then(
          async (result) => {
            if (result.isConfirmed) {
              const data = await addUserInChannels(id);
              if (data) {
                alert(`${channelInfo.name} 채널에 가입하셨습니다`);
                setIsMember(true);
              }
            }
          }
        );
    } else {
      if (channelInfo)
        confirmAlert(`${channelInfo.name} 채널에서 탈퇴하시겠습니까?`).then(
          async (result) => {
            if (result.isConfirmed) {
              if (!user) return;
              const data = await deleteUserInChannels(user?.id, id);
              if (data) {
                alert(`${channelInfo.name} 채널에서 탈퇴하셨습니다`);
                setIsMember(false);
              }
            }
          }
        );
    }
  };

  const handleChannelDelete = () => {
    if (channelInfo)
      confirmAlert(`${channelInfo.name} 채널을 삭제하시겠습니까?`).then(
        async (result) => {
          if (result.isConfirmed) {
            const data = await deleteChannel(id);
            if (data) {
              alert(`${channelInfo.name} 채널이 삭제되었습니다`);
              setIsChannelChanged();
              setNochannel(true);
            } else {
              alert(`${channelInfo.name} 채널 삭제에 실패했습니다`);
            }
          }
        }
      );
  };

  const handleDelete = (feedId: string) => {
    confirmAlert("피드를 삭제하시겠습니까?").then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteFeed(feedId);
        if (data) {
          showToast("피드가 삭제되었습니다");
          setFeedData(
            (prev) => prev?.filter((f) => f.feed_id !== feedId) ?? null
          );
          setSelectedFeed((prev) => (prev?.feed_id === feedId ? null : prev));
        }
      }
    });
  };

  const handleDeleteReply = (feedReplyId: string) => {
    confirmAlert("댓글을 삭제하시겠습니까?").then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteReply(feedReplyId);
        if (data?.length !== 0) {
          showToast("댓글이 삭제되었습니다");
          setRepliesData(
            (prev) =>
              prev?.filter((f) => f.feed_reply_id !== feedReplyId) ?? null
          );
        } else showToast("댓글이 삭제되지 않았습니다");
      }
    });
  };

  useEffect(() => {
    feedDataRef.current = feedData;
  }, [feedData]);

  // 마지막 요소에서 20개를 더 로드
  // FeedData 종속성을 제거하고 feedData를 이용해
  const renderTailFeeds = useCallback(async () => {
    const currentFeedData = feedDataRef.current;
    if (!currentFeedData || currentFeedData.length === 0) return;

    const lastTime = currentFeedData[currentFeedData.length - 1].created_at;
    if (!lastTime) return;

    const afterFeedData = await getFeedsByChannelAndAfter(id, lastTime!);
    if (!afterFeedData || afterFeedData.length === 0) {
      setHasMoreTailFeeds(false);
      return;
    }

    const updatedFeeds = afterFeedData.map((feed) => {
      const previewUrl = getPreviewImage(feed);
      return { ...feed, preview_url: previewUrl };
    });

    // 중복 제거
    setFeedData((prev) => {
      const prevFeeds = prev ?? [];
      const existingFeedIds = new Set(prevFeeds.map((f) => f.feed_id));
      const uniqueNewFeeds = updatedFeeds.filter(
        (f) => !existingFeedIds.has(f.feed_id)
      );
      return [...prevFeeds, ...uniqueNewFeeds];
    });
  }, [id]);

  const handleAddSubmitFeed = useCallback(
    (data: Tables<"feeds">) => {
      if (!userProfile?.nickname && !userProfile?.nickname) return;
      const newFeed = convertNewFeedToFeedData(
        data,
        userProfile?.nickname,
        userProfile?.profile_url
          ? `${profileBucketUrl}/${userProfile?.profile_url}`
          : null
      );

      setFeedData((prev: FeedWithPreview[] | null) => [
        ...(prev ?? []),
        newFeed,
      ]);
    },
    [userProfile?.nickname, userProfile?.profile_url]
  );

  // 첫 요소에서 20개를 더 로드
  const renderHeadFeeds = useCallback(async () => {
    if (!feedData || feedData.length === 0) return;

    const firstFeedId = feedData[0].feed_id!;
    const container = feedContainerRef.current;
    const firstEl = feedRefs.current[firstFeedId];
    const prevOffset = firstEl?.getBoundingClientRect().top ?? 0;

    const beforeTime = feedData[0].created_at;
    if (!beforeTime) return;

    const beforeFeedData = await getFeedsByChannelAndBefore(id, beforeTime!);
    if (!beforeFeedData || beforeFeedData.length === 0) {
      setHasMoreHeadFeeds(false);
      return;
    }

    const updatedFeeds = beforeFeedData.map((feed) => {
      const previewUrl = getPreviewImage(feed);
      return { ...feed, preview_url: previewUrl };
    });

    setFeedData((prev) => {
      const prevFeeds = prev ?? [];
      const existingFeedIds = new Set(prevFeeds.map((f) => f.feed_id));
      const uniqueNewFeeds = updatedFeeds.filter(
        (f) => !existingFeedIds.has(f.feed_id)
      );
      return [...uniqueNewFeeds, ...prevFeeds];
    });

    requestAnimationFrame(() => {
      // 선택된 피드가 있다면 해당 피드로 스크롤
      const newFirstEl = feedRefs.current[firstFeedId];
      const newOffset = newFirstEl?.getBoundingClientRect().top ?? 0;

      if (container) {
        container.scrollTop += newOffset - prevOffset;
      }
    });
  }, [feedData, id]);

  // 옵저버 상태 업데이트
  const observerStateRef = useRef({
    hasMoreHeadFeeds,
    hasMoreTailFeeds,
    isTopFetching,
    isBottomFetching,
  });

  useEffect(() => {
    observerStateRef.current = {
      hasMoreHeadFeeds,
      hasMoreTailFeeds,
      isTopFetching,
      isBottomFetching,
    };
  });

  // 옵저버 콜백 Ref
  const setTopLiRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (topObserverRef.current) {
        topObserverRef.current.disconnect();
      }

      topObserverRef.current = new IntersectionObserver(([entry]) => {
        if (
          entry.isIntersecting &&
          !observerStateRef.current.isTopFetching &&
          observerStateRef.current.hasMoreHeadFeeds
        ) {
          setIsTopFetching(true);
          renderHeadFeeds().finally(() => setIsTopFetching(false));
        }
      });

      if (node) {
        topObserverRef.current.observe(node);
      }
    },
    [renderHeadFeeds]
  );

  const setBottomLiRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (bottomObserverRef.current) {
        bottomObserverRef.current.disconnect();
      }

      bottomObserverRef.current = new IntersectionObserver(([entry]) => {
        // 최하단을 보고 있는 상태 (스크롬됨)
        setIsAtBottom(entry.isIntersecting);

        if (
          entry.isIntersecting &&
          !observerStateRef.current.isBottomFetching &&
          observerStateRef.current.hasMoreTailFeeds
        ) {
          setIsBottomFetching(true);
          renderTailFeeds().finally(() => setIsBottomFetching(false));
        }
      });

      if (node) {
        bottomObserverRef.current.observe(node);
      }
    },
    [renderTailFeeds]
  );

  const scrollToBottom = useCallback(() => {
    const el = feedContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const scrollToBottomReply = useCallback(
    (containerRef: React.RefObject<HTMLDivElement | null>) => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    },
    []
  );

  const initLoadState = () => {
    setHasMoreHeadFeeds(true);
    setHasMoreTailFeeds(true);
    setIsTopFetching(false);
    setIsBottomFetching(false);
  };
  // useEffect

  useEffect(() => {
    if (!repliesData || repliesData.length === 0) {
      return;
    }
    scrollToBottomReply(replyContainerRef);
  }, [repliesData, scrollToBottomReply]);

  useEffect(() => {
    // 이미 target 데이터가 있다면 로드 중단
    if (feedData) {
      const target = feedData.find((f) => f.feed_id === paramsFeedId);
      if (target) {
        setSelectedFeed(target);
        return;
      }
    }

    setSelectedFeed(null);

    const fetchData = async () => {
      if (paramsFeedId) {
        const centerFeeds = await getFeedByTargetId(paramsFeedId); // 새로운 API
        if (!centerFeeds) return;

        const updatedFeeds = centerFeeds.map((feed) => {
          const previewUrl = getPreviewImage(feed);
          return { ...feed, preview_url: previewUrl };
        });

        setFeedData(updatedFeeds);
        setSelectedFeed(
          updatedFeeds.find((f) => f.feed_id === paramsFeedId) ?? null
        );
      } else {
        const now = new Date(Date.now()).toISOString();
        const feeds = await getFeedsByChannelAndBefore(id, now);
        if (!feeds) return;

        const updatedFeeds = feeds.map((feed) => {
          const previewUrl = getPreviewImage(feed);
          return { ...feed, preview_url: previewUrl };
        });
        setFeedData(updatedFeeds);

        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }

      // 유저가 있는 경우에만 userLikes 호출
      if (user) {
        const likes = await getLikesByUserId(user.id);
        setUserLikes(likes?.map((like) => like.feed_id) ?? []);
      }
    };

    fetchData();
  }, [id, user, lastUpdatedAt, paramsFeedId, scrollToBottom]);

  // realtime 구독 처리
  useEffect(() => {
    // 최하단에서 모든 데이터를 알고 있는 것이 아니면 return
    if (!id || hasMoreTailFeeds) return;

    const channel = supabase
      .channel(`channel_${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "feeds",
          filter: `channel_id=eq.${id}`,
        },
        () => {
          renderTailFeeds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasMoreTailFeeds, id, renderTailFeeds]);

  useEffect(() => {
    async function check() {
      if (id && user) {
        const flag = await checkUserInChannels(id, user?.id);
        setIsMember(flag);
      }
    }
    check();
  }, [id, user]);

  // 데이터를 받았을 때 하단을 보고 있다면 하단으로 이어서 이동
  useEffect(() => {
    if (!isAtBottom || !feedData || feedData.length === 0 || hasMoreTailFeeds)
      return;
    scrollToBottom();
  }, [feedData, isAtBottom, scrollToBottom]);

  useEffect(() => {
    async function checkCreateMember() {
      if (id && user) {
        const data = await getChannelCreateUser(id);
        if (!data) return;
        if (data?.length === 0) {
          setNochannel(true);
          return;
        }
        setIsCreateMember(data[0].owner_id === user.id);
      }
    }
    checkCreateMember();
  }, [id, user]);

  useEffect(() => {
    const getChannelInfo = async () => {
      const data = await getChannelInfoById(id);
      if (!data) {
        setChannelInfo({ name: "삭제된 채널입니다", description: null });
        return;
      }
      setChannelInfo(data[0]);
    };
    getChannelInfo();
    initLoadState();
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

  // 선택된 피드 바뀔때마다 스크롤이동하기
  useEffect(() => {
    if (!selectedFeed?.feed_id) return;
    scrollToSelectedFeed();
  }, [selectedFeed]);

  // 유저아바타프리뷰 url 가져오기
  const getPreviewImage = (
    feed: Tables<"get_feeds_with_user_and_likes">
  ): string | undefined => {
    if (!feed.author_profile_url) return;
    return `${profileBucketUrl}/${feed.author_profile_url}`;
  };

  return (
    <>
      {noChannel ? (
        <NoChannel />
      ) : (
        <div className={S.contentContainer}>
          <div className={S.contentWrapper}>
            <div className={S.channelInfo}>
              {channelInfo ? (
                <details className={S.channelDescription}>
                  <summary>{channelInfo.name}</summary>
                  <p>{channelInfo.description}</p>
                </details>
              ) : (
                <p>채널 정보 가져오는중 . . .</p>
              )}
              {user ? (
                isMember ? (
                  isCreateMember ? (
                    <button
                      type="button"
                      className={S.channelLeaveButton}
                      onClick={handleChannelDelete}
                      style={{ backgroundColor: `red` }}
                    >
                      채널삭제하기
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={S.channelLeaveButton}
                      onClick={handleChannelJoin}
                    >
                      채널탈퇴하기
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    className={S.channelJoinButton}
                    onClick={handleChannelJoin}
                  >
                    채널가입하기
                  </button>
                )
              ) : null}
            </div>
            {feedData?.length === 0 ? (
              <div className={S.noFeed}>게시물이 없습니다</div>
            ) : (
              <>
                <div className={S.feedArea}>
                  <ul
                    className={`${S.contentArea} ${selectedFeed && isMobile ? S.mobileHidden : ""}`}
                    ref={feedContainerRef}
                  >
                    <li className={S.observerDiv} ref={setTopLiRef}></li>
                    {feedData?.map((data) => renderFeedComponent(data))}
                    <li className={S.observerDiv} ref={setBottomLiRef}></li>
                  </ul>
                  <div
                    className={
                      isMobile
                        ? `${S.detailContentArea} ${selectedFeed ? `${S.open} ${S.mobile}` : `${S.mobile}`}`
                        : `${S.detailContentArea} ${selectedFeed ? S.open : ""}`
                    }
                  >
                    {selectedFeed ? (
                      <>
                        <DetailFeeds
                          type={isMobile ? "detail" : "default"}
                          feedItem={selectedFeed}
                          replies={repliesData?.length}
                          onToggleLike={onToggleLike}
                          isUserLike={
                            userLikes?.includes(selectedFeed.feed_id!) ?? false
                          }
                          scrollToSelectedFeed={scrollToSelectedFeed}
                        />
                        <FeedReplies
                          replies={repliesData}
                          handleDeleteReply={handleDeleteReply}
                          replyContainerRef={replyContainerRef}
                        />
                        <InputReplies
                          currentFeedId={selectedFeed.feed_id!}
                          setUpdateReplies={setUpdateReplies}
                          scrollToBottom={() =>
                            scrollToBottomReply(replyContainerRef)
                          }
                        />
                        <button
                          type="button"
                          className={S.closeButton}
                          onClick={() => {
                            // 뒤로가기 시에도 피드 상세를 남기지 않음.
                            window.history.replaceState(
                              {},
                              "",
                              `/Channel/${id}`
                            );
                            setSelectedFeed(null);
                          }}
                        >
                          <img src={close} alt="" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            )}
            <div
              className={`${S.inputFeedContainer} ${selectedFeed ? S.hide : ""}`}
            >
              <InputFeed
                curChannelId={id}
                handleAddSubmitFeed={handleAddSubmitFeed}
                isMember={isMember}
              />
            </div>
          </div>
          <div className={S.userListArea}>
            <UserList channelId={id} isMember={isMember} />
          </div>
        </div>
      )}
    </>
  );
}

export default Channel;
