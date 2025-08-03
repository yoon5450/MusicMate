import type { Tables } from "@/@types/database.types";
import S from "./ChannelFeed.module.css";
import { isFeedHaveLink } from "@/utils/isFeedHaveLink";
import heartEmpty from "@/assets/heart_empty.svg";
import heartFilled from "@/assets/heart_filled.svg";
import { timeFormater } from "@/utils/timeFormatter";
import { useRouter } from "@/router/RouterProvider";
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
    author_id,
  },
  onReplyClicked,
  isActive,
  isUserLike,
  onToggleLike,
}: Props) {
  const { setHistoryRoute } = useRouter();

  const handleClick = (userId: string | null) => {
    if(!userId) return;
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`);
  };
  

  if (!feed_id) return;
  const handleReplyClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReplyClicked();
  };
  const kst = timeFormater(created_at!);
  const createdTime =
    kst!.slice(0, 10) + " " + kst!.slice(11, 16);

  return (
    <div
      id={feed_id}
      className={isActive ? `${S.container} ${S.active}` : `${S.container}`}
    >
      <div className={S.userAvatarContainer}>
        <img
          className={S.userAvatar}
          src={preview_url ? preview_url : "/music_mate_symbol_fixed.svg"}
          alt="작성자프로필이미지"
          onClick={()=> handleClick(author_id)}
          style={{cursor: "pointer"}}
        />
      </div>
      <div className={S.messageFeed}>
        <p
          onClick={()=> handleClick(author_id)}
          style={{cursor: "pointer"}}
        >
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
    </div>
  );
}

export default ChannelFeedMessage;
