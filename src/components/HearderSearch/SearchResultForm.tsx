import type { Tables } from "@/@types/database.types"
import S from './SearchResultForm.module.css';

interface Props{
  item: Tables<"feeds">
}

function SearchResultForm({item}:Props) {
  return (
      <div id={item.id ?? undefined} className={S.resultItemContainer}>
        <div className={S.content}>{item.content}</div>
      </div>
  )
}
export default SearchResultForm