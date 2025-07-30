import { useParams } from "@/router/RouterProvider";
import InputFeed from "./components/InputFeed";
import S from "./Channel.module.css";
import ChannelFeedMessage from "./components/ChannelFeedMessage";
import { useEffect, useState } from "react";
import { getFeedsWithAllByChannelId } from "@/api";
import type { Tables } from "@/@types/database.types";
import { getAvatarUrl } from "@/api/user_avatar";
import ChannelFeedAudio from "./components/ChannelFeedAudio";
import { UserList } from "./components/UserList";

type FeedWithPreview = Tables<"get_feeds_with_user_and_likes"> & {
  preview_url?: string;
};

function Channel() {
  const { id } = useParams();

  const [feedData, setFeedData] = useState<FeedWithPreview[] | null>(null);
  
  useEffect(() => {
    const getFeedsByChannelId = async () => {
      const data = await getFeedsWithAllByChannelId(id);
      if (!data) return;
      const updatedFeeds = [];

      for (const feed of data) {
        const previewUrl = await getPreviewImage(feed);
        updatedFeeds.push({ ...feed, preview_url: previewUrl });
      }
      setFeedData(updatedFeeds);
    };
    getFeedsByChannelId();
  }, [id]);

  const getPreviewImage = async (
    feed: Tables<"get_feeds_with_all">
  ): Promise<string | undefined> => {
    if (!feed.author_profile_url) return;

    const blob = await getAvatarUrl(feed.author_profile_url);
    if (!blob) return;

    return URL.createObjectURL(blob);
  };

  return (
    <>
      <div className={S.contentContainer}>
        <div className={S.contentWrapper}>
          <div className={S.contentArea}>
            <div>{`${id} 채널입니다.`}</div>
            {/* <div className={S.test}>`${id.repeat(300)}`</div> */}
            {feedData
              ? feedData.map((feed) => {
                  if (
                    feed.message_type === "default" ||
                    feed.message_type === "image"
                  )
                    return (
                      <ChannelFeedMessage key={feed.feed_id} feedItem={feed} />
                    );
                  if (feed.message_type === "clip")
                    return (
                      <ChannelFeedAudio key={feed.feed_id} feedItem={feed} />
                    );
                })
              : null}
          </div>
          <div className={S.userListArea}>
            <UserList channelId={id}/>
          </div>
        </div>
        <div className={S.detailContentArea}></div>
      </div>
      <InputFeed curChannelId={id} />
    </>
  );
}

export default Channel;
