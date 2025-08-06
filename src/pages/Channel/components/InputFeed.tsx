import React, { useEffect, useId, useRef, useState } from "react";
import S from "./InputFeed.module.css";
import RecordButton, { type RecordingData } from "@/components/RecordButton";
import SubmitClipForm from "@/components/SubmitClipForm";
import buttonImg from "@/assets/circle_plus_button.svg";
import sendImg from "@/assets/send_icon.svg";
import { setFilePreview } from "@/utils/setImagePreview";
import { addFeedsWithFiles } from "@/api";
import { useAuth } from "@/auth/AuthProvider";
import { alert, showToast } from "@/components/common/CustomAlert";

interface Props {
  curChannelId: string;
  isMember: boolean | null;
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
}

function InputFeed({ curChannelId, isMember, handleAddSubmitFeed }: Props) {
  // 데이터 상태관리
  const [recordingData, setRecordingData] = useState<RecordingData>();
  const [image, setImage] = useState<File>();
  const { isAuth } = useAuth();

  // Node Ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // View 상태관리
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>();

  // Id
  const audioBtnId = useId();
  const imageBtnId = useId();
  const submitBtnId = useId();

  useEffect(() => {
    textareaRef.current?.focus();
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  const initialize = () => {
    const text = textareaRef.current;
    if (text) {
      text.value = "";
      text.focus();
      text.style.height = "auto";
    }
    setImage(undefined);
    setImagePreview(undefined);
  };

  const handleClose = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = textareaRef.current;
    if (!isAuth) {
      alert("로그인 후에 글을 올릴 수 있습니다.");
      return;
    }

    if (!isMember) {
      alert(
        "채널에 가입한 후에 글을 올릴 수 있습니다.<br/>채널가입하기 버튼을 클릭하여 채널 가입을<br/>진행해주세요!"
      );
      return;
    }

    if (text) {
      const content = text.value.trim();
      if (!content) {
        alert("내용을 입력해주세요.");
        return;
      }

      const data = await addFeedsWithFiles({
        content: text.value,
        channel_id: curChannelId,
        message_type: "default",
        image_file: image,
      });

      handleAddSubmitFeed(data);

      initialize();
    }
  };

  const handleTextKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // submit 동작을 form에 위임시킴
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordingData({ url, file });
    } else {
      showToast("유효하지 않은 파일입니다.");
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(file);
      setFilePreview(file, setImagePreview);
    } else {
      showToast("유효하지 않은 파일입니다.");
    }
  };

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
        key={recordingData?.url ?? "no-data"}
        recordingData={recordingData}
        setRecordingData={setRecordingData}
        curChannelId={curChannelId}
        handleAddSubmitFeed={handleAddSubmitFeed}
        isMember={isMember}
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
      <form className={S.feedSubmittForm} onSubmit={handleSubmit}>
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
          onKeyDown={handleTextKeydown}
          placeholder="메세지를 입력하세요"
        />

        <RecordButton
          setRecordingData={setRecordingData}
          recordingData={recordingData}
        />

        <label htmlFor={submitBtnId} className="a11y-hidden">
          메세지 보내기
        </label>
        <button type="submit" id={submitBtnId}>
          <img width={"36px"} src={sendImg} alt="제출" />
        </button>
      </form>
    </div>
  );
}

export default InputFeed;
