import { useRef, useState } from "react";
import closeIcon from "@/assets/close.svg";
import S from "./HeaderSearch.module.css";
import { getFeedsByKeyword } from "@/api";
import { throttle } from "@/utils/Throttle";

interface Props {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

function HeaderSearch({ setIsSearch }: Props) {
  const [keyword, setKeyword] = useState<string>();
  const textInputRef = useRef<HTMLInputElement>(null);

  const searchAction = async (k:string) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    if(keyword) throttleSearch.current(value);
  };

  const handleSubmit = () => {};

  const throttleSearch = useRef(
    throttle(async (k: string) => {
      const data = await searchAction(k);
      console.log(data);
    }, 100)
  );

  return (
    <>
      <form onSubmit={handleSubmit} className={S.searchForm}>
        <input
          ref={textInputRef}
          className={S.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          onChange={handleChange}
          onKeyDown={handleTextKeydown}
        />

        <button
          type="button"
          className={S.closeBtn}
          onClick={() => setIsSearch(false)}
        >
          <img src={closeIcon} width={"50%"} />
        </button>
      </form>
    </>
  );
}

export default HeaderSearch;
