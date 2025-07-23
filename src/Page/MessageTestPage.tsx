import { useId, useState } from "react";
import S from "./MessageTestPage.module.css";
import type { Enums } from "@/@types/database.types";
import { addFeeds } from "@/api";
import {
  isFeedHaveLink,
  isFeedHaveMultipleLinks,
} from "@/utils/isFeedHaveLink";

interface MessageForm {
  title: string | null;
  content: string | null;
  audio_url: string | null;
  channel_id: string;
  image_url: string | null;
  message_type: Enums<"message_type">;
}

function MessageTestPage() {
  const titleId = useId();
  const contentId = useId();

  const [messageForm, setMessageForm] = useState<MessageForm>(() => ({
    title: null,
    content: null,
    audio_url: null,
    channel_id: "8646681a-383e-47e1-8b87-a9fffe7aa6ed",
    image_url: null,
    message_type: "default",
  }));
  const [showHideButtons, setShowHideButtons] = useState(false);
  //   const [containsClip, setContainsClip] = useState(false);
  //   const [containsRecord, setContainsRecord] = useState(false);
  const [multipleLink, setMultipleLink] = useState(false);

  const handleUpdateMessageForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newMessageForm = {
      ...messageForm,
      [name]: value,
      //   ...(containsClip || containsRecord
      //     ? { message_type: "clip" as Enums<"message_type"> }
      //     : {}),
    };
    setMessageForm(newMessageForm);
    if (!messageForm.content) return;
    const multipleLink = isFeedHaveMultipleLinks(messageForm.content);
    setMultipleLink(multipleLink);
  };

  const handleHideButtons = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowHideButtons(!showHideButtons);
  };

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const feedDataAdded = await addFeeds(messageForm);
    if (!feedDataAdded) return;
    return feedDataAdded;
  };

  return (
    <>
      {multipleLink ? <p>⚠️링크는 하나만 올릴 수 있습니다⚠️</p> : null}
      {messageForm.content && !multipleLink
        ? isFeedHaveLink(messageForm.content)
        : null}
      <form className={S.ChannelMessageForm} onSubmit={handleSubmitMessage}>
        <div className={S.formControl}>
          <label htmlFor={titleId}>제목</label>
          <input
            id={titleId}
            type="text"
            name="title"
            onChange={handleUpdateMessageForm}
          />
        </div>
        <div className={S.formControl}>
          <label htmlFor={contentId}>내용</label>
          <textarea
            id={contentId}
            name="content"
            onChange={handleUpdateMessageForm}
          />
        </div>
        <button
          type="button"
          className={S.addFileButton}
          onClick={handleHideButtons}
        >
          파일추가
        </button>
        <div
          className={S.hiddenButtons}
          style={showHideButtons ? { display: "block" } : { display: "none" }}
        >
          <button type="button">파일</button>
          <button type="button">녹음</button>
        </div>
        <button type="submit">보내기</button>
      </form>
    </>
  );
}

export default MessageTestPage;
