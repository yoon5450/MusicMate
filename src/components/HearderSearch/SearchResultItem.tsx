import type { Tables } from "@/@types/database.types"
import S from './SearchResultItem.module.css';

interface Props{
  item: Tables<"view_feed_search">
}

function SearchResultItem({item}:Props) {
  return (
      <div id={item.id ?? undefined} className={S.resultItemContainer}>
        <div>{item.title}</div>
        <div className={S.content}>{item.content}</div>
        <div>{item.nickname} </div>
      </div>
  )
}
export default SearchResultItem