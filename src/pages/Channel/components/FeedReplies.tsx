import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import FeedReply from "./FeedReply";
interface Props {
  replies: Tables<"get_replies_with_user">[] | null;
  handleDeleteReply: (feedReplyId: string) => void;
  replyContainerRef: React.RefObject<HTMLDivElement | null>;
}
function FeedReplies({ replies, handleDeleteReply, replyContainerRef }: Props) {
  return (
    <div className={S.replyContainer} ref={replyContainerRef}>
      <ul className={S.replies}>
        {replies?.length === 0 ? (
          <div className={S.noReply}>댓글이 없습니다</div>
        ) : (
          replies?.map((reply) => (
            <FeedReply
              key={reply.feed_reply_id}
              reply={reply}
              handleDeleteReply={handleDeleteReply}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default FeedReplies;
