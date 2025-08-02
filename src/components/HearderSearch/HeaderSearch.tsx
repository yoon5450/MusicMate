import { useEffect, useRef, useState } from "react";
import closeIcon from "@/assets/close.svg";
import S from "./HeaderSearch.module.css";
import { getFeedsByKeyword } from "@/api";
import { debounce } from "@/utils/debounce";
import type { Tables } from "@/@types/database.types";
import SearchResultItem from "./SearchResultItem";

interface Props {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO: 채널 내부에서 검색
// TODO: 엔터를 눌렀을 때 
function HeaderSearch({ setIsSearch }: Props) {
  const [searchResult, setSearchResult] = useState<
    Tables<"view_feed_search">[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const initFunc = () => {
    setSearchResult([]);
    setSearchKeyword("")
    setSearchInput("")
  }

  const searchAction = async (k: string) => {
    if (!k) return;

    const data = await getFeedsByKeyword(k);
    return data;
  };

  const handleTextKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // submit 동작을 form에 위임시킴
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  useEffect(() => {
    const inputText = inputRef.current
    if(inputText) inputText.focus();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim()) setSearchResult([]);
    debounceSearch.current(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const debounceSearch = useRef(
    debounce(async (k: string) => {
      setSearchKeyword(k);
      const data = await searchAction(k);
      if (data) setSearchResult(data);
    }, 300)
  );

  return (
    <div className={S.headerSearchWrapper}>
      <form onSubmit={handleSubmit} className={S.searchForm}>
        <input
          className={S.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          onChange={handleChange}
          onKeyDown={handleTextKeydown}
          ref={inputRef}
          value={searchInput}
        />

        <button
          type="button"
          className={S.closeBtn}
          onClick={() => setIsSearch(false)}
        >
          <img src={closeIcon} width={"50%"} />
        </button>

        {searchResult.length > 0 ? (
          <div className={S.searchResultContainer}>
            {searchResult.slice(0, 5).map((item) => (
              <SearchResultItem item={item} initFunc={initFunc} keyword={searchKeyword} key={item.id}/>
            ))}
          </div>
        ) : undefined}
      </form>
    </div>
  );
}

export default HeaderSearch;
