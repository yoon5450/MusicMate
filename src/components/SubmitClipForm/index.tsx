import { useId, useState } from "react";
import type { RecordingData } from "../RecordButton";
import S from "./SubmitClipForm.module.css";
import CustomAudioPlayer from "../CustomAudioPlayer";
import imgIcon from "@/assets/add_image_icon.svg";
import { addFeedsWithFiles } from "@/api";
import { setFilePreview } from "@/utils/setImagePreview";
import { useAuth } from "@/auth/AuthProvider";
import { alert } from "../common/CustomAlert";

interface Props {
  recordingData: RecordingData | undefined;
  curChannelId: string;
  setRecordingData: React.Dispatch<
    React.SetStateAction<RecordingData | undefined>
  >;
  handleAddSubmitFeed: (data: {
    audio_url: string | null;
    author_id: string;
    channel_id: string;
    content: string | null;
    created_at: string;
    id: string;
    image_url: string | null;
    message_type: "default" | "clip" | "image";
    title: string | null;
  }) => void;
  isMember: boolean | null;
}

function SubmitClipForm({
  recordingData,
  setRecordingData,
  curChannelId,
  handleAddSubmitFeed,
  isMember,
}: Props) {
  const { user } = useAuth(); // 유저정보(id, 이메일)

  const [imagePreview, setImagePreview] = useState<string | undefined | null>(
    ""
  );
  const [feedImage, setFeedImage] = useState<File | undefined | null>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const previewId = useId();

  // 플레이어 초기화, 닫기
  function handleDelete() {
    if (recordingData?.url) window.URL.revokeObjectURL(recordingData?.url);
    setRecordingData({ url: null, blob: null, file: null });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFeedImage(file);
    if (file) setFilePreview(file, setImagePreview);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("전송");

    if (!user) {
      alert("로그인 후에 글을 올릴 수 있습니다.");
      return;
    }

    if (!isMember) {
      alert(
        "채널에 가입한 후에 글을 올릴 수 있습니다.<br/>채널가입하기 버튼을 클릭하여 채널 가입을<br/>진행해주세요!"
      );
      return;
    }

    const data = await addFeedsWithFiles({
      title,
      content,
      message_type: "clip",
      channel_id: curChannelId,
      image_file: feedImage,
      audio_file: recordingData?.file,
    });

    handleAddSubmitFeed(data);

    handleDelete();
  }

  // 열 때마다 리렌더(초기화)
  return (
    recordingData?.url && (
      <div className={S.wrapper}>
        <form className={S.playerForm} onSubmit={handleSubmit} action="">
          <label htmlFor={previewId} className={S.addImgBtn}>
            <img src={imagePreview ? imagePreview : imgIcon} width={"40px"} />
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
