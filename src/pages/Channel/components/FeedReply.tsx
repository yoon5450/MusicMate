import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import { useEffect, useState } from "react";
import { getAvatarUrlPreview } from "@/api/user_avatar";
interface Props {
  reply: Tables<"get_replies_with_user">;
}

function FeedReply({ reply }: Props) {
  const { content, created_at, nickname, profile_url, feed_reply_id } = reply;
  const createdTime =
    created_at!.slice(0, 10) + " " + created_at!.slice(11, 16);

  const [profilePreview, setProfilePreview] = useState("");
  useEffect(() => {
    const getImageUrl = async () => {
      if (!profile_url) return;
      const data = await getAvatarUrlPreview(profile_url);
      if (data) setProfilePreview(data);
    };
    getImageUrl();
  }, [profile_url]);
  if (feed_reply_id)
    return (
      <li className={S.reply} key={feed_reply_id} id={feed_reply_id}>
        <div className={S.userAvatarContainer}>
          <img
            className={S.userAvatar}
            src={
              profilePreview ? profilePreview : "/music_mate_symbol_fixed.svg"
            }
            alt="작성자"
          />
        </div>
        <div className={S.messageFeed}>
          <p>
            {nickname} <small>{createdTime}</small>
          </p>
          <p>{content}</p>
        </div>
      </li>
    );
}

export default FeedReply;
