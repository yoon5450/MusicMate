import type { Tables } from "@/@types/database.types";

export default (
  list: Tables<"get_feeds_with_all">[],
  slicePosition = list.length
) => {
  let updated = list
    .map((item) => ({ ...item }))
    .sort((a, b) => a.like_count! - b.like_count!);

  return updated.slice(0, slicePosition);
};
