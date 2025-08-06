/**
 * 인기 게시글을 보여주고 각 게시글을 클릭 시 해당 채널로 이동합니다.
 */
import type { Tables } from "@/@types/database.types";
import S from "./style.FeedList.module.css";
import { useEffect, useState } from "react";
import { getPopularFeeds } from "@/api";
import ChannelLink from "@/components/common/Link/ChannelLink";
import heartFilledWhite from "@/assets/heart_filled_white.svg";
import { truncateText } from "@/utils/truncateText";

function FeedList() {
  const [feeds, setFeeds] = useState<Tables<"get_feeds_with_user_and_likes">[]>(
    []
  );

  useEffect(() => {
    const fetchFeeds = async () => {
      const data = await getPopularFeeds();
      if (data) setFeeds(data);
    };
    fetchFeeds();
  }, []);

  return (
    <>
      <h2 className={S.title}>인기 게시글</h2>
      <div className={S.feedGrid}>
        {feeds?.slice(0, 6).map((feed) => (
          <div key={feed.feed_id} className={S.feedItem}>
            <ChannelLink channelId={feed.channel_id!} feedId={feed.feed_id!}>
              <div className={S.postContent}>
                <p className={S.preview}>
                  {feed.content ? truncateText(feed.content, 40) : null}
                </p>
              </div>
            </ChannelLink>

            <div className={S.likeContainer}>
              <img
                style={{ width: "16px", height: "16px" }}
                src={heartFilledWhite}
                alt="좋아요"
              />
              <span className={S.likeCount}>{feed.like_count ?? 0}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default FeedList;
