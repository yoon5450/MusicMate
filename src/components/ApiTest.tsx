import type { Tables } from "@/@types/database.types";
import { getByKeywordFeeds } from "@/api/feeds";
import { useEffect, useState } from "react";

type FeedTypes = Tables<"feeds">[] | null;

function ApiTest() {
  const [feeds, setFeeds] = useState<FeedTypes | null>(null);

  useEffect(() => {
    const getFeeds = async () => {
      const feeds: FeedTypes = await getByKeywordFeeds("하세요");
      setFeeds(feeds);
    };

    getFeeds();
  }, []);

  return (
    <ul>
      {feeds &&
        feeds.map((feed) => {
          return Object.entries(feed).map(([key, value]) => (
            <li>
              {key} : {value}
            </li>
          ));
        })}
    </ul>
  );
}
export default ApiTest;
