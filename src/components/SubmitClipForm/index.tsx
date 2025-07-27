import { useRef, useState } from "react";
import type { RecordingData } from "../RecordButton";
import S from "./SubmitClipForm.module.css";
import CustomAudioPlayer from "../CustomAudioPlayer";

interface Props {
  recordingData: RecordingData | undefined;
  setRecordingData: React.Dispatch<
    React.SetStateAction<RecordingData | undefined>
  >;
}

function SubmitClipForm({ recordingData, setRecordingData }: Props) {
  const imagePreview = useRef("");

  // 플레이어 초기화, 닫기
  function handleDelete() {
    setRecordingData({ url: null, blob: null, file: null });
  }

  function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    
  }

  return (
    recordingData?.url && (
      <div className={S.wrapper}>
        <form className={S.playerForm} onSubmit={handleSubmit} action="">
          <button type="button" className={S.addImgBtn}>
            <img src="/music_mate_symbol_fixed.svg" className={S.imgPreview} />
          </button>

          <div className={S.formDescription}>
            <input type="text" placeholder="녹음 제목" className={S.title} />
            <textarea
              placeholder="녹음 내용에 대해서 설명글을 적어주세요"
              className={S.description}
            />

            <div className={S.playerWrapper}>
              <CustomAudioPlayer recordingData={recordingData} />
            </div>

            <div className={S.btnGroup}>
              <button type="button" onClick={handleDelete}>삭제</button>
              <button type="submit">업로드</button>
            </div>
          </div>
        </form>
        <button className={S.closeBtn} onClick={handleDelete}>
          ✕
        </button>
      </div>
    )
  );
}
export default SubmitClipForm;
