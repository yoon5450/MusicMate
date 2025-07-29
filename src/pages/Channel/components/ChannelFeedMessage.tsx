import type { Tables } from "@/@types/database.types";
import S from "./ChannelFeed.module.css";
import { isFeedHaveLink } from "@/utils/isFeedHaveLink";
interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
}

function ChannelFeedMessage({
  feedItem: {
    // feed_id,
    content,
    image_url,
    // created_at,
    author_nickname,
    preview_url,
    like_count,
  },
}: Props) {
  return (
    <div className={S.container}>
      <div className={S.userAvatarContainer}>
        <img
          className={S.userAvatar}
          src={preview_url ? preview_url : "/music_mate_symbol_fixed.svg"}
          alt="작성자프로필이미지"
        />
      </div>
      <div className={S.messageFeed}>
        <p>{author_nickname}</p>
        {image_url ? (
          <div className={S.imgContainer}>
            <img src={image_url} alt="" />
          </div>
        ) : null}{" "}
        <div className={S.messageContents}>
          {content ? isFeedHaveLink(content) : null}
        </div>
      </div>
      <div className={S.messageReactButton}>
        <button type="button">좋아요 {like_count}</button>
        <button type="button">댓글</button>
      </div>
    </div>
  );
}

export default ChannelFeedMessage;
