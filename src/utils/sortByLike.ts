import type { Tables } from "@/@types/database.types";

export default (
  list: Tables<"get_feeds_with_all">[],
  slicePosition = list.length
) => {


  return (list
    .map((item) => ({ ...item }))
    .sort((a, b) => a.like_count! - b.like_count!)
    .slice(0, slicePosition))
};
