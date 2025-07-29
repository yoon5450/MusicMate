import { useEffect, useId, useRef, useState } from "react";
import S from "./InputFeed.module.css";
import RecordButton, { type RecordingData } from "@/components/RecordButton";
import SubmitClipForm from "@/components/SubmitClipForm";
import buttonImg from "@/assets/circle_plus_button.svg";
import { setFilePreview } from "@/utils/setImagePreview";
import { addFeedsWithFiles } from "@/api";

function InputFeed({ curChannelId }: { curChannelId: string }) {
  // 데이터 상태관리
  const [recordingData, setRecordingData] = useState<RecordingData>();
  const [image, setImage] = useState<File>();
  const [contents, setContents] = useState<string>();

  // Node Ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // View 상태관리
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>();

  // Id
  const audioBtnId = useId();
  const imageBtnId = useId();

  const handleClose = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const submitDefaultFeed = () => {
    addFeedsWithFiles(contents);
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordingData({ url, file });
    } else {
      alert("유효하지 않은 파일입니다.");
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(file);
      setFilePreview(file, setImagePreview);
    } else {
      alert("유효하지 않은 파일입니다.");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

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
      <SubmitClipForm
        key={Date.now()}
        recordingData={recordingData}
        setRecordingData={setRecordingData}
        curChannelId={curChannelId}
      />

      {/* 이미지 프리뷰 영역 */}
      {imagePreview && (
        <div className={S.imagePreviewWrapper}>
          <img className={S.imagePreview} src={imagePreview} />
          <button
            type="button"
            className={S.imageDeleteBtn}
            onClick={() => {
              setImage(undefined);
              setImagePreview(undefined);
            }}
          >
            x
          </button>
        </div>
      )}

      {/* 입력 Form 영역 */}
      <form className={S.feedSubmittForm} onSubmit={submitDefaultFeed}>
        {/* 추가 기능 버튼 */}
        <div ref={wrapperRef} className={S.dropdownWrapper}>
          <button type="button" onClick={() => setOpen(!open)}>
            <img width={"32px"} src={buttonImg} alt="추가 버튼" />
          </button>
          {open && (
            <ul className={`${S.dropdownList}`}>
              <li>
                <label htmlFor={audioBtnId}>클립 오디오 파일로 업로드</label>
                <input
                  type="file"
                  accept="audio/*"
                  id={audioBtnId}
                  name={audioBtnId}
                  style={{ display: "none" }}
                  onChange={handleUploadAudio}
                />
              </li>
              <li>
                <label htmlFor={imageBtnId}>피드에 이미지 추가</label>
                <input
                  type="file"
                  accept="image/*"
                  id={imageBtnId}
                  name={imageBtnId}
                  style={{ display: "none" }}
                  onChange={handleUploadImage}
                />
              </li>
            </ul>
          )}
        </div>

          <textarea
            ref={textareaRef}
            rows={1}
            className={S.textInput}
            onInput={handleInputText}
            placeholder="채널에 메세지 보내기"
          />

        <RecordButton
          setRecordingData={setRecordingData}
          recordingData={recordingData}
        />
      </form>
    </div>
  );
}

export default InputFeed;
