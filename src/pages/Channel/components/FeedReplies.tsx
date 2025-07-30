import type { Tables } from "@/@types/database.types";
import S from "./DetailContents.module.css";
import FeedReply from "./FeedReply";
interface Props {
  replies: Tables<"get_replies_with_user">[] | null;
}
function FeedReplies({ replies }: Props) {
  return (
    <div className={S.replyContainer}>
      <ul className={S.replies}>
        {replies
          ? replies?.map((reply) => (
              <FeedReply key={reply.feed_reply_id} reply={reply} />
            ))
          : null}
      </ul>
    </div>
  );
}

export default FeedReplies;
