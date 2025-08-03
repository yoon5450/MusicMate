import React, { useEffect, useId, useRef, useState } from "react";
import S from "./InputReplies.module.css";
import sendImg from "@/assets/send_icon.svg";
import { useAuth } from "@/auth/AuthProvider";
import { useParams } from "@/router/RouterProvider";
import { checkUserInChannels } from "@/api";
import { addReply } from "@/api/replies";
import { alert } from "@/components/common/CustomAlert";
interface Props {
  currentFeedId: string;
  setUpdateReplies: (time: number) => void;
  scrollToBottom: () => void;
}
function InputReplies({
  currentFeedId,
  setUpdateReplies,
  scrollToBottom,
}: Props) {
  const { isAuth, user } = useAuth();
  const { id: channelId } = useParams();
  const [isMember, setIsMember] = useState<boolean | null>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Id
  const submitBtnId = useId();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    async function check() {
      if (channelId && user) {
        const flag = await checkUserInChannels(channelId, user?.id);
        setIsMember(flag);
      }
    }
    check();
    console.log(isMember);
  }, [channelId, user]);

  const initialize = () => {
    const text = textareaRef.current;
    if (text) {
      text.value = "";
      text.focus();
      text.style.height = "auto";
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = textareaRef.current;

    if (!isAuth) {
      alert("로그인 후에 댓글을 작성할 수 있습니다.");
      if (text) text.value = "";
      return;
    }

    if (!isMember) {
      alert("채널에 가입한 후에 댓글을 작성할 수 있습니다.");
      if (text) text.value = "";
      return;
    }

    if (text) {
      const content = text.value.trim();
      if (!content) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      if (!user) return;
      const data = await addReply({
        author_id: user.id,
        content: text.value,
        feed_id: currentFeedId,
      });
      if (!data) return;
      setUpdateReplies(Date.now());
      initialize();
    }
  };

  const handleTextKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
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
      {/* 입력 Form 영역 */}
      <form className={S.feedSubmittForm} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          rows={1}
          className={S.textInput}
          onInput={handleInputText}
          onKeyDown={handleTextKeydown}
          placeholder="메세지를 입력하세요"
        />

        <label htmlFor={submitBtnId} className="a11y-hidden">
          메세지 보내기
        </label>
        <button type="submit" id={submitBtnId}>
          <img width={"36px"} src={sendImg} alt="댓글등록" />
        </button>
      </form>
    </div>
  );
}

export default InputReplies;
