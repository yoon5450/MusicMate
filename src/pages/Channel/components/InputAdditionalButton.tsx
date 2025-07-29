import { useEffect, useId, useRef, useState } from "react";
import S from "./InputAdditonalButton.module.css";
import buttonImg from "@/assets/circle_plus_button.svg";
import React from "react";

function InputAdditionalButton() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const audioBtnId = useId();
  const imageBtnId = useId();

  const handleClose = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleUploadAudio = () => {};

  // document 이벤트로 처리했다가 제거되면 이벤트 제거
  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  return (
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
              onChange={handleUploadAudio}
            />
          </li>
        </ul>
      )}
    </div>
  );
}

export default React.memo(InputAdditionalButton);
