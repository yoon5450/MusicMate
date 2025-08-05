import type { Tables } from "@/@types/database.types";
import S from "./ChannelFeed.module.css";
import { isFeedHaveLink } from "@/utils/isFeedHaveLink";
import heartEmpty from "@/assets/heart_empty.svg";
import heartFilled from "@/assets/heart_filled.svg";
import { timeFormater } from "@/utils/timeFormatter";
import { useRouter } from "@/router/RouterProvider";
import { useAuth } from "@/auth/AuthProvider";
import buttonImg from "@/assets/more_button.svg";
import { useEffect, useRef, useState } from "react";
import { alert, showToast } from "@/components/common/CustomAlert";
import { copyFeedLinkToClipboard } from "@/utils/copyFeedLinkToClipboard";
interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
  onReplyClicked: () => void;
  isActive: boolean;
  isUserLike: boolean;
  onToggleLike: (feedId: string) => void;
  handleDelete: (feedId: string) => void;
  scrollForDropdown: (
    open: boolean,
    dropdownRef: React.RefObject<HTMLUListElement | null>
  ) => void;
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
    channel_id,
  },
  onReplyClicked,
  isActive,
  isUserLike,
  onToggleLike,
  handleDelete,
  scrollForDropdown,
}: Props) {
  const { user } = useAuth();
  const { setHistoryRoute } = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  useEffect(() => {
    scrollForDropdown(open, dropdownRef);
  }, [open]);

  const handleClose = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleClick = (userId: string | null) => {
    if (!userId) return;
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`);
  };

  if (!feed_id) return;
  const handleReplyClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReplyClicked();
  };

  const handleDeleteFeed = () => {
    setOpen(false);
    if (author_id !== user?.id) alert("피드 작성자만 삭제할 수 있습니다");
    else handleDelete(feed_id);
  };
  const kst = timeFormater(created_at!);
  const createdTime = kst!.slice(0, 10) + " " + kst!.slice(11, 16);

  const handleCopyFeedLink = () => {
    copyFeedLinkToClipboard(channel_id ?? "", feed_id);
    showToast("클립보드에 피드 링크를 복사했습니다")
  };

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
          onClick={() => handleClick(author_id)}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={S.messageFeed}>
        <p>
          <span
            onClick={() => handleClick(author_id)}
            style={{ cursor: "pointer" }}
          >
            {author_nickname}
          </span>
          <small style={{ marginLeft: "4px" }}>{createdTime}</small>
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
        <div ref={wrapperRef} className={S.dropdownWrapper}>
          <button type="button" onClick={() => setOpen(!open)}>
            <img height={"28px"} src={buttonImg} alt="더보기 버튼" />
          </button>
          {open && (
            <ul className={S.dropdownList} ref={dropdownRef}>
              <li>
                <button
                  type="button"
                  className={
                    author_id === user?.id
                      ? `${S.deleteButton}`
                      : `${S.deleteButton} ${S.disabled}`
                  }
                  onClick={handleDeleteFeed}
                >
                  삭제
                </button>
              </li>
              <li>
                <button type="button" onClick={handleCopyFeedLink}>
                  공유
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChannelFeedMessage;
