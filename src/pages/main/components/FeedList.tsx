import type { Tables } from "@/@types/database.types";
import S from "./style.FeedList.module.css";
import { useEffect, useState } from "react";
import { getPopularFeeds } from "@/api";


function FeedList() {
  const [feeds,setFeeds] = useState<Tables<"get_feeds_with_user_and_likes">[]>([]);
  

  useEffect(()=>{
    const fetchFeeds = async()=>{
      const data = await getPopularFeeds();
      if(data) setFeeds(data);
    };
    fetchFeeds();
  },[]);

  return (
    <>
      <h2 className={S.title}>인기 게시글</h2>
     
    </>
  );
}
export default FeedList;
