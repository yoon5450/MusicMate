import ChannelCreateForm from "@/components/channel/ChannelCreateForm";
import { useState } from "react";
import S from '../components/channel/channel.module.css';

function ChannelPage() {

  const [showForm, setShowForm] = useState(false);



  return (
    <div>
      <button onClick={() => setShowForm(true)}>채널 추가하기</button>

     {showForm && (
      <div className={S.modalOverlay}>
      <div className={S.modalContent} style={{ position: "relative" }}>
      <button
        className={S.exitButton}
        onClick={() => setShowForm(false)}
        aria-label="모달 닫기"
      >
        ×
      </button>
      <ChannelCreateForm />
    </div>
  </div>
)}

    </div>
  );
}

export default ChannelPage