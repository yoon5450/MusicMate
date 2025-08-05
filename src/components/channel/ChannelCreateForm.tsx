import { useEffect, useId, useRef, useState } from "react";
import { addChannels } from "@/api/channels";
import { getGenres } from "@/api/genres";
import supabase from "@/utils/supabase";
import { alert } from "../common/CustomAlert";
import S from "./ChannelCreateForm.module.css";

type GenreType = {
  code: number;
  name: string;
};

type CreatedChannelType = {
  onSuccess?: (id: string) => void;
};

function ChannelCreateForm({ onSuccess }: CreatedChannelType) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const nameId = useId();
  const descriptionId = useId();
  const genre_codeId = useId();

  useEffect(() => {
    (async () => {
      const data = await getGenres();
      if (data) setGenres(data);
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!selectRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedGenre = genres.find((g) => String(g.code) === genre);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !genre) {
      alert("채널 이름, 설명, 장르를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    try {
      const result = await addChannels({
        name,
        description,
        genre_code: Number(genre),
        owner_id: userData.user!.id,
      });

      console.log(result);
      if (!result) {
        alert(
          "채널을 생성할 수 없습니다. <br/>중복된 채널 이름이 존재할 수 있습니다."
        );
      } else {
        onSuccess?.(result);
        alert("채널이 생성되었습니다.");
      }
    } catch {
      alert("채널 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={S.formContainer}>
      <div className={S.formGroup}>
        <label htmlFor={nameId}>채널 이름</label>
        <input
          id={nameId}
          className={S.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className={S.formGroup}>
        <label htmlFor={descriptionId}>채널 설명</label>
        <textarea
          id={descriptionId}
          className={S.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className={S.formGroup} ref={selectRef}>
        <label htmlFor={genre_codeId}>장르 코드</label>
        <div
          id={genre_codeId}
          className={S.customSelectBox}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={S.selectedText}>
            {selectedGenre ? selectedGenre.name : "장르를 선택하세요."}
          </span>
          <span className={S.arrow}>&#9662;</span>
        </div>

        {isOpen && (
          <ul className={`${S.optionsList} `}>
            {genres.map((g) => (
              <li
                key={g.code}
                className={`${S.optionItem} ${String(g.code) === genre ? S.selected : ""}`}
                onClick={() => {
                  setGenre(String(g.code));
                  setIsOpen(false);
                }}
              >
                {g.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className={S.createButton} disabled={isLoading}>
        {isLoading ? "채널 생성 중..." : "채널 만들기"}
      </button>
    </form>
  );
}

export default ChannelCreateForm;
