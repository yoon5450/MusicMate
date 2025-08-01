/**
 * 채널페이지로 이동하는 컴포넌트
 * @param channelId 채널 ID
 * @param children 버튼 안에 들어갈 요소(텍스트)
 * @returns 클릭 시 해당 채널로 라우팅 된다
 */

import type React from 'react';
import S from './ChannelLink.module.css';
import { useRouter } from "@/router/RouterProvider";

interface ChannelLinkProps{
  channelId : string;
  children : React.ReactNode;
  feedId? : string;
}

function ChannelLink({
  channelId,
  children,
  feedId
}:ChannelLinkProps) {
  const {setHistoryRoute} = useRouter();

  const handleClick = () => {
    const newPath = feedId ?
      `/Channel/${channelId}/feed/${feedId}` :
      `/Channel/${channelId}`;
      window.history.pushState(null, "", newPath);
      setHistoryRoute(newPath); 
  }

  return (
    <button 
      onClick={handleClick} 
      className={S.linkButton}
      aria-label={`채널 ${channelId}로 이동하기`}
    >
      {children}
    </button>
  );
}
export default ChannelLink