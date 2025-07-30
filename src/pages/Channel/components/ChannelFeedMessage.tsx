import type { Tables } from "@/@types/database.types";
import S from "./ChannelFeed.module.css";
import { isFeedHaveLink } from "@/utils/isFeedHaveLink";
import heartEmpty from "@/assets/heart_empty.svg";
import heartFilled from "@/assets/heart_filled.svg";
interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
  onReplyClicked: () => void;
  isActive: boolean;
  isUserLike: boolean;
  onToggleLike: (feedId: string) => void;
}

function ChannelFeedMessage({
  feedItem: {
    feed_id,
    content,
    image_url,
    created_at,
    author_nickname,
    preview_url,
    like_count,
  },
  onReplyClicked,
  isActive,
  isUserLike,
  onToggleLike,
}: Props) {
  if (!feed_id) return;
  const handleReplyClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReplyClicked();
  };
  const createdTime =
    created_at!.slice(0, 10) + " " + created_at!.slice(11, 16);

  return (
    <li
      id={feed_id}
      className={isActive ? `${S.container} ${S.active}` : `${S.container}`}
    >
      <div className={S.userAvatarContainer}>
        <img
          className={S.userAvatar}
          src={preview_url ? preview_url : "/music_mate_symbol_fixed.svg"}
          alt="작성자프로필이미지"
        />
      </div>
      <div className={S.messageFeed}>
        <p>
          {author_nickname} <small>{createdTime}</small>
        </p>
        {image_url ? (
          <div className={S.imgContainer}>
            <img className={S.feedImage} src={image_url} alt="피드이미지" />
          </div>
        ) : null}{" "}
        <div className={S.messageContents}>
          {content ? isFeedHaveLink(content) : null}
        </div>
      </div>
      <div className={S.messageReactButton}>
        <button
          type="button"
          onClick={() => onToggleLike(feed_id!)}
          className={isUserLike ? S.likedButton : ""}
        >
          <img
            style={{ width: "16px", height: "16px" }}
            src={isUserLike ? heartFilled : heartEmpty}
            alt="like icon"
          />{" "}
          {like_count}
        </button>
        <button type="button" onClick={handleReplyClicked}>
          댓글
        </button>
      </div>
    </li>
  );
}

export default ChannelFeedMessage;
