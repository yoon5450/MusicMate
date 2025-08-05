import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import heartEmpty from "@/assets/heart_empty_white.svg";
import heartFilled from "@/assets/heart_filled_white.svg";
import { useRouter } from "@/router/RouterProvider";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";

interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
  replies: number | undefined;
  onToggleLike: (feedId: string) => void;
  isUserLike: boolean;
  scrollToSelectedFeed: () => void;
  type?: "default" | "detail";
}

function DetailFeeds({
  feedItem: {
    feed_id,
    preview_url,
    author_nickname,
    like_count,
    author_id,
    title,
    content,
    audio_url,
    image_url,
  },
  replies,
  onToggleLike,
  isUserLike,
  scrollToSelectedFeed,
  type = "default",
}: Props) {
  const { setHistoryRoute } = useRouter();

  const handleClick = (userId: string | null) => {
    if (!userId) return;
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`);
  };

  const handleLikeToggle = () => {
    onToggleLike(feed_id!);
  };

  console.log(type, "type");

  return (
    <div className={S.container}>
      <div className={S.feedInfo}>
        <div className={S.userAvatarContainer}>
          <img
            className={S.userAvatar}
            src={preview_url ? preview_url : "/music_mate_symbol_fixed.svg"}
            alt="작성자프로필이미지"
            onClick={() => handleClick(author_id)}
            style={
              type === "default" ? { cursor: "pointer" } : { cursor: "pointer" }
            }
          />
        </div>
        <div className={S.messageFeed}>
          <p
            onClick={() => handleClick(author_id)}
            style={{ cursor: "pointer" }}
          >
            {author_nickname}
          </p>
          {type === "default" ? (
            <div className={S.messageFeedButtons}>
              <button type="button" onClick={scrollToSelectedFeed}>
                현재 게시물로 돌아가기
              </button>
            </div>
          ) : null}
        </div>
      </div>


      {type === "detail" && (
        <>
          {image_url && (
            <div>
              <img style={{ width: "80%" }} src={image_url} alt="" />
            </div>
          )}
          {audio_url && (
            <CustomAudioPlayer recordingData={{ url: audio_url }} />
          )}
          {title && <div>{title}</div>}
          {content && <div>{content}</div>}
        </>
      )}

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
