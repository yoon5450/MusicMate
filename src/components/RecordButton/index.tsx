import { useRef, useState } from "react";
import S from "./RecordButton.module.css";

function RecordButton() {
  // 리로드될때마다 청크 데이터나 청취 객체가 초기화되면 안되므로 Ref로 선언
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunkRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();

  async function startRecording() {
    // 새 녹음을 시작하면 비워주기
    audioChunkRef.current = [];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(undefined);
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunkRef.current.push(event.data);
      }
    };

    // 멈출때 이벤트 콜백을 설정
    mediaRecorder.onstop = handleRecordStop;

    mediaRecorder.start();
    setIsRecording(true);
  }

  // mediaRecorder를 중지시키고 recording 상태 state를 false로 설정
  const stopRecording = () => {
    if (mediaRecorderRef) {
      console.log("posed!");
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  async function handleRecordStop() {
    const audioBlob = new Blob(audioChunkRef.current, { type: "audio/webm" });
    const file = new File([audioBlob], "recording.webm", {
      type: "audio/webm",
    });

    const audioUrl = window.URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);

    const formData = new FormData();
    formData.append("audio", file);
  }

  return (
    <>
      <audio controls src={audioUrl}></audio>
      <button
        type="button"
        onClick={() => (isRecording ? stopRecording() : startRecording())}
      >
        <div className={S.outerCircle}>
          <div className={S.innerCircle}></div>
        </div>
      </button>
    </>
  );
}

export default RecordButton;
