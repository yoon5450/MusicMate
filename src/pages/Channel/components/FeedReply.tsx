import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import { useEffect, useState } from "react";
import { getAvatarUrlPreview } from "@/api/user_avatar";
import { useRouter } from "@/router/RouterProvider";
import { useAuth } from "@/auth/AuthProvider";
import { timeFormater } from "@/utils/timeFormatter";
interface Props {
  reply: Tables<"get_replies_with_user">;
  handleDeleteReply: (feedReplyId: string) => void;
}

function FeedReply({ reply, handleDeleteReply }: Props) {
  const {
    content,
    created_at,
    nickname,
    profile_url,
    feed_reply_id,
    author_id,
  } = reply;
  const { setHistoryRoute } = useRouter();
  const { user } = useAuth();

  const handleClick = (userId: string | null) => {
    if (!userId) return;
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`);
  };
  const kst = timeFormater(created_at!);
  const createdTime = kst!.slice(0, 10) + " " + kst!.slice(11, 16);

  const [profilePreview, setProfilePreview] = useState("");
  useEffect(() => {
    const getImageUrl = async () => {
      if (!profile_url) return;
      const data = await getAvatarUrlPreview(profile_url);
      if (data) setProfilePreview(data);
    };
    getImageUrl();
  }, [profile_url]);

  const onDeleteReply = () => {
    handleDeleteReply(feed_reply_id!);
  };

  if (feed_reply_id)
    return (
      <li className={S.reply} key={feed_reply_id} id={feed_reply_id}>
        <div className={S.replyContents}>
          <div className={S.userAvatarContainer}>
            <img
              className={S.userAvatar}
              src={
                profilePreview ? profilePreview : "/music_mate_symbol_fixed.svg"
              }
              alt="작성자"
              onClick={() => handleClick(author_id)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={S.messageFeed}>
          <p>
            <span onClick={() => handleClick(author_id)} style={{ cursor: "pointer" }}>
              {nickname}
            </span>
            <small style={{ marginLeft: "4px" }}>{createdTime}</small>
          </p>
            <p>{content}</p>
          </div>
        </div>
        {author_id === user?.id ? (
          <button
            type="button"
            className={S.deleteButton}
            onClick={onDeleteReply}
          >
            삭제
          </button>
        ) : null}
      </li>
    );
}

export default FeedReply;
