import type { Tables } from "@/@types/database.types";
import S from "./SearchResultItem.module.css";
import React, { useContext } from "react";
import { RouterContext } from "@/router/RouterProvider";
import { timeFormater } from "@/utils/timeFormatter";

interface Props {
  item: Tables<"view_feed_search">;
  initFunc: () => void;
  keyword?: string;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: 키워드 기반 하이라이팅
function SearchResultItem({ item, initFunc, setIsSearch }: Props) {
  const kst = timeFormater(item.created_at!);
  const createdTime = kst!.slice(0, 10) + " " + kst!.slice(11, 16);

  const { setHistoryRoute } = useContext(RouterContext)!;

  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    initFunc();
    const feedId = item.id!;
    const targetChannel = item.channel_id;
    const newPath = `/Channel/${targetChannel}/feed/${feedId}`;
    setHistoryRoute(newPath);
    history.pushState(null, "", newPath);
    setIsSearch(false);
  };

  return (
    <div
      id={item.id ?? undefined}
      className={S.resultItemContainer}
      onClick={handleClick}
    >
      <div>
        <div>{item.nickname}</div>
        <div>
          <small>{createdTime}</small>
        </div>
      </div>
      <div className={S.mainContents}>
        <div>
          <h3>{item.title}</h3>
        </div>
        <div className={S.content}>{item.content}</div>
      </div>
      <div>{item.message_type === "default" ? "메세지" : "클립"}</div>
    </div>
  );
}
export default SearchResultItem;
