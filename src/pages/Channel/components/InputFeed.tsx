import { useRef } from "react";
import S from "./InputFeed.module.css";
import buttonImg from "@/assets/circle_plus_button.svg";
import RecordButton from "@/components/RecordButton";

function InputFeed() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInputText() {
    const cur = textareaRef.current;
    if (cur) {
      cur.style.height = "auto";
      cur.style.height = `${cur.scrollHeight}px`;
    }
  }

  function handleInputFocus() {}



  return (
    <div className={S.wrapper}>
      <form className={S.feedSubmittForm} action="">
        <button type="button">
          <img width={"32px"} src={buttonImg} alt="추가 버튼" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          className={S.textInput}
          onInput={handleInputText}
          onFocus={handleInputFocus}
          placeholder="채널에 메세지 보내기"
        />
        
        <RecordButton/>
      </form>
    </div>
  );
}
export default InputFeed;
