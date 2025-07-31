import type { Tables } from "@/@types/database.types";
import S from "./SearchResultItem.module.css";

interface Props {
  item: Tables<"view_feed_search">;
}

function SearchResultItem({ item }: Props) {
  const createdTime =
    item.created_at!.slice(0, 10) + " " + item.created_at!.slice(11, 16);

  return (
    <div id={item.id ?? undefined} className={S.resultItemContainer}>
      <div>
        <div>{item.nickname}</div>
        <div><small>{createdTime}</small></div>
      </div>
      <div className={S.mainContents}>
        <div><h3>{item.title}</h3></div>
        <div className={S.content}>{item.content}</div>
      </div>
      <div>
        {item.message_type === "default" ? "메세지" : "클립" }
      </div>
    </div>
  );
}
export default SearchResultItem;
