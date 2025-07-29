import { useId, useState } from "react";
import type { RecordingData } from "../RecordButton";
import S from "./SubmitClipForm.module.css";
import CustomAudioPlayer from "../CustomAudioPlayer";
import imgIcon from "@/assets/add_image_icon.svg";
import { addFeedsWithFiles } from "@/api";

interface Props {
  recordingData: RecordingData | undefined;
  curChannelId: string;
  setRecordingData: React.Dispatch<
    React.SetStateAction<RecordingData | undefined>
  >;
}

function SubmitClipForm({
  recordingData,
  setRecordingData,
  curChannelId,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | undefined | null>();
  const [feedImage, setFeedImage] = useState<File | undefined | null>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const previewId = useId();

  // 플레이어 초기화, 닫기
  function handleDelete() {
    if (recordingData?.url) window.URL.revokeObjectURL(recordingData?.url);
    setRecordingData({ url: null, blob: null, file: null });
  }

  function handleImageChange(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFeedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("전송");

    addFeedsWithFiles({
      title,
      content,
      message_type: "clip",
      channel_id: curChannelId,
      image_file: feedImage,
      audio_file: recordingData?.file,
    });

    handleDelete();
  }

  // 열 때마다 강제 리렌더(초기화)
  return (
    recordingData?.url && (
      <div className={S.wrapper}>
        <form className={S.playerForm} onSubmit={handleSubmit} action="">
          <label htmlFor={previewId} className={S.addImgBtn}>
            <img src={imagePreview ? imagePreview : imgIcon} />
          </label>
          <input
            id={previewId}
            name={previewId}
            aria-label="클립 이미지 업로드"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <div className={S.formDescription}>
            <input
              type="text"
              placeholder="녹음 제목"
              className={S.title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              placeholder="녹음 내용에 대해서 설명글을 적어주세요"
              className={S.description}
            />

            <div className={S.playerWrapper}>
              <CustomAudioPlayer recordingData={recordingData} />
            </div>

            <div className={S.btnGroup}>
              <button type="button" onClick={handleDelete}>
                삭제
              </button>
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
