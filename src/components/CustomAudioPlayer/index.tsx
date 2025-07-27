import S from "./CustomAudioPlayer.module.css";
import playBtnImg from "@/assets/play_button.svg";
import playBackBtnImg from "@/assets/play_back_button.svg";
import playForwardBtnImg from "@/assets/play_forward_button.svg";
import pauseBtnImg from "@/assets/pause_button.svg";
import type { RecordingData } from "../RecordButton";
import { useEffect, useRef, useState } from "react";
import { throttle } from "@/utils/Throttle";

interface Props {
  recordingData: RecordingData | undefined;
}

// TODO : 실시간 스트리밍 기능도 수행할 수 있도록 확장, 다양한 형태 ( 소형화 등 구현 )
// 렌더링 최적화도 생각해볼것
function CustomAudioPlayer({ recordingData }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const throttleSeek = useRef(
    throttle((time: number) => {
      const audio = audioRef.current;
      if (audio) audio.currentTime = time;
    }, 100)
  );

  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    throttleSeek.current(newTime);
  };

  const handleAudioEnd = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentTime(0);
  };

  // 오디오의 url이 바뀔 때마다 실행
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !recordingData?.url) return;

    const handleLoadMetaData = () => {
      if (!isFinite(audio.duration) || audio.duration === Infinity) {
        const handleTimeUpdate = () => {
          if (isFinite(audio.duration)) {
            setDuration(audio.duration);
            // 기존 timeupdate 이벤트를 지우고
            audio.removeEventListener("timeupdate", handleTimeUpdate);
          }
        };
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.currentTime = 0.02; // duration 로딩을 위해 재생 처리처럼
      } else {
        setDuration(audio.duration);
      }

      setCurrentTime(0);
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        console.log("duration 변경됨:", audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadMetaData);
    audio.addEventListener("durationchange", handleDurationChange);

    // 명시적 메타데이터 로딩을 위한 강제 load
    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadMetaData);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, [recordingData?.url]);

  // 재생 상태 관리
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    let raf: number;
    const update = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        raf = requestAnimationFrame(update);
      }
    };

    console.log(audio.duration);

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  // TODO : input range 스로틀 이용할것
  return (
    <div className={S.wrapper}>
      <div className={S.btnGroup}>
        <button type="button">
          <img src={playBackBtnImg} alt="" />
        </button>
        <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
          <img src={isPlaying ? pauseBtnImg : playBtnImg} alt="플레이버튼" />
        </button>
        <button type="button">
          <img src={playForwardBtnImg} alt="" />
        </button>
      </div>

      {recordingData?.url && (
        <audio
          key={recordingData?.url}
          ref={audioRef}
          src={recordingData?.url}
          preload="metadata"
          onEnded={handleAudioEnd}
        ></audio>
      )}

      {/* TODO: 나중에 커스텀 DIV로 하는 게 낫겠다. 기본 range 속성이 브라우저별로 너무 다름. */}
      <input
        className={S.progress}
        type="range"
        min={0}
        max={isFinite(duration) ? duration : 30}
        step={0.02}
        value={currentTime}
        onChange={handleChangeRange}
      />
    </div>
  );
}
export default CustomAudioPlayer;
