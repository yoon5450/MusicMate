import type { Tables } from "@/@types/database.types";
import S from "./ChannelFeed.module.css";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
interface Props {
  feedItem: Tables<"get_feeds_with_user_and_likes"> & { preview_url?: string };
}

function ChannelFeedAudio({
  feedItem: {
    // feed_id,
    title,
    content,
    /*녹음파일 */
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
        <h3>{title}</h3>
        <div className={S.audioPlayerAndImg}>
          {image_url ? <img src={image_url} alt="" /> : null}
          <div className={S.audioPlayer}>
            <CustomAudioPlayer recordingData={undefined /*녹음파일*/} />
          </div>
        </div>
        <div className={S.messageContents}>{content}</div>
      </div>
      <div className={S.messageReactButton}>
        <button type="button">좋아요 {like_count}</button>
        <button type="button">댓글</button>
      </div>
    </div>
  );
}

export default ChannelFeedAudio;
