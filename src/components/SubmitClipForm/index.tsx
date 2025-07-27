import { useState } from "react";
import type { RecordingData } from "../RecordButton";
import S from "./SubmitClipForm.module.css";
import CustomAudioPlayer from "../CustomAudioPlayer";

interface Props {
  recordingData: RecordingData | undefined;
}

function SubmitClipForm({ recordingData }: Props) {
  const [imagePreview, setImagePreview] = useState();

  // 플레이어 닫기 버튼
  function handleClose() {

  }

  return (
    <div className={S.wrapper}>
      <button className={S.closeBtn} onClick={handleClose}>
        ✕
      </button>
      <form className={S.playerForm} action="">
        <button type="button" className={S.addImgBtn}>
          <img src="/music_mate_symbol_fixed.svg" className={S.imgPreview} />
        </button>

        <div className={S.formDescription}>
          <input type="text" placeholder="유저 녹음" className={S.title} />
          <textarea
            placeholder="어떤 녹음 내용인가요?"
            className={S.description}
          />
          <div className={S.playerWrapper}>
            <CustomAudioPlayer recordingData={recordingData} />
          </div>
        </div>
      </form>
    </div>
  );
}
export default SubmitClipForm;
