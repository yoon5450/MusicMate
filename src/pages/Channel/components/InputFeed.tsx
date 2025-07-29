import { useRef, useState } from "react";
import S from "./InputFeed.module.css";
import RecordButton, { type RecordingData } from "@/components/RecordButton";
import SubmitClipForm from "@/components/SubmitClipForm";
import InputAdditionalButton from "./InputAdditionalButton";

function InputFeed({curChannelId}:{curChannelId:string}) {
  const [recordingData, setRecordingData] = useState<RecordingData>()
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  function handleInputText() {
    const cur = textareaRef.current;
    if (cur) {
      cur.style.height = "auto";
      cur.style.height = `${cur.scrollHeight}px`;
    }
  }

  return (
    <div className={S.wrapper}>
      {/* key로 열릴 때마다 key 초기화 */}
      <SubmitClipForm key={Date.now()} recordingData={recordingData} setRecordingData={setRecordingData} curChannelId={curChannelId}/>

      <form className={S.feedSubmittForm} action="">
        <InputAdditionalButton/>

        <textarea
          ref={textareaRef}
          rows={1}
          className={S.textInput}
          onInput={handleInputText}
          placeholder="채널에 메세지 보내기"
        />
        
        <RecordButton setRecordingData={setRecordingData} recordingData={recordingData}/>
      </form>
    </div>
  );
}

export default InputFeed;
