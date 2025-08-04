import React, { useEffect } from "react";
import S from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalTypes {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

function Modal({ children, onClose, title }: ModalTypes) {
  //모달이 열렸을 때 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // portal로 문제 해결
  return createPortal(
    <div className={S.modalOverlay} onClick={onClose}>
      <div className={S.modalContent} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={S.title}>{title}</h2>}
        <button
          className={S.exitButton}
          onClick={onClose}
          aria-label="모달 닫기"
        >
          x
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
