import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import heartEmpty from "@/assets/heart_empty_white.svg";
import heartFilled from "@/assets/heart_filled_white.svg";

interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
  replies: number | undefined;
  onToggleLike: (feedId: string) => void;
  isUserLike: boolean;
  scrollToSelectedFeed: () => void;
}

function DetailFeeds({
  feedItem: { feed_id, preview_url, author_nickname, like_count },
  replies,
  onToggleLike,
  isUserLike,
  scrollToSelectedFeed,
}: Props) {
  const handleLikeToggle = () => {
    onToggleLike(feed_id!);
  };

  return (
    <div className={S.container}>
      <div className={S.feedInfo}>
        <div className={S.userAvatarContainer}>
          <img
            className={S.userAvatar}
            src={preview_url ? preview_url : "/music_mate_symbol_fixed.svg"}
            alt="작성자프로필이미지"
          />
        </div>
        <div className={S.messageFeed}>
          <p>{author_nickname}</p>
          <button type="button" onClick={scrollToSelectedFeed}>
            현재 게시물로 돌아가기
          </button>
        </div>
      </div>
      <div className={S.reactsInfo}>
        <button type="button" onClick={handleLikeToggle}>
          <img
            src={isUserLike ? heartFilled : heartEmpty}
            alt="like icon"
            style={{ width: "16px", height: "16px", marginRight: "4px" }}
          />
          {like_count}
        </button>
        <p>댓글 {replies ?? ""}</p>
      </div>
    </div>
  );
}

export default DetailFeeds;
