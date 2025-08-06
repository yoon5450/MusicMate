import { useEffect, useRef, useState } from "react";
import closeIcon from "@/assets/close.svg";
import S from "./HeaderSearch.module.css";
import { getFeedsByKeyword } from "@/api";
import { debounce } from "@/utils/debounce";
import type { Tables } from "@/@types/database.types";
import SearchResultItem from "./SearchResultItem";
import { useParams } from "@/router/RouterProvider";

interface Props {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO: 채널 내부에서 검색
// TODO: 엔터를 눌렀을 때
function HeaderSearch({ setIsSearch }: Props) {
  const [searchResult, setSearchResult] = useState<
    Tables<"view_feed_search">[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [fullSearchMode, setFullSearchMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chanMode, setChanMode] = useState<boolean>(false);
  const { id } = useParams();

  const initFunc = () => {
    setSearchResult([]);
    setSearchKeyword("");
    setSearchInput("");
    setIsSearch(false);
    setFullSearchMode(false);
  };

  const searchAction = async (
    k: string,
    channelId: string | undefined = undefined
  ) => {
    if (!k) return;

    const data = await getFeedsByKeyword(k, channelId);
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
    const inputText = inputRef.current;
    if (inputText) inputText.focus();
    if (id) setChanMode(true);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim()) setSearchResult([]);
    debounceSearch.current(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFullSearchMode(true);
    const key = inputRef.current?.value;
    if (key) debounceSearch.current(key);
  };

  const chanModeRef = useRef(chanMode);

  useEffect(() => {
    chanModeRef.current = chanMode;
  }, [chanMode]);

  const debounceSearch = useRef(
    debounce(async (k: string) => {
      const curMode = chanModeRef.current;
      setSearchKeyword(k);
      const channelId = curMode ? id : undefined;
      const data = await searchAction(k, channelId);
      if (data) setSearchResult(data);
    }, 300)
  );

  return (
    <div className={S.headerSearchWrapper}>
      <form onSubmit={handleSubmit} className={S.searchForm}>
        {
          <button
            className={`${S.targetChannelBtn} ${chanMode ? S.chanMode : S.allMode}`}
            type="button"
            onClick={() => {
              if (id) setChanMode((prev) => !prev);
              const key = inputRef.current?.value;
              if (key) debounceSearch.current(key);
            }}
          >
            {chanMode ? `채널에서 검색` : `전체에서 검색`}
          </button>
        }

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
            {fullSearchMode
              ? searchResult.map((item) => (
                  <SearchResultItem
                    item={item}
                    initFunc={initFunc}
                    keyword={searchKeyword}
                    key={item.id}
                  />
                ))
              : searchResult
                  .slice(0, 5)
                  .map((item) => (
                    <SearchResultItem
                      item={item}
                      initFunc={initFunc}
                      keyword={searchKeyword}
                      key={item.id}
                    />
                  ))}
          </div>
        ) : undefined}
      </form>
    </div>
  );
}

export default HeaderSearch;
