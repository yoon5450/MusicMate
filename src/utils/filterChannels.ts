import type { ChannelsType } from "@/api";

/**
 * 사용자의 상태(로그인, 선호 장르)에 따라 사이드바에 표시할 채널 목록을 필터링
 * - 비로그인 또는 선호 장르가 없으면 전체 채널을 반환.
 * - 로그인 상태이면 선호 장르 채널과 내가 만든 채널을 합쳐서 보여주기 (중복 제거)
 * @param channelList - 전체 채널 목록
 * @param preferredGenres - 사용자의 선호 장르 코드 배열
 * @param currentUserId - 현재 로그인한 사용자의 ID
 * @returns 필터링된 채널 목록
 */

export function filterChannels(
  channelList: ChannelsType[],
  preferredGenres: number[],
  currentUserId: string | null
): ChannelsType[] {
  // 선택된 채널 {채널이름 : boolean}
  const selectedChannels: Record<string, boolean> = {};

  if (!currentUserId || preferredGenres.length === 0) {
    return channelList;
  }

  const preferred = channelList.filter((channel) => {
    if (
      preferredGenres.includes(channel.genre_code!) &&
      !selectedChannels[channel.id]
    ) {
      selectedChannels[channel.id] = true;
      return true;
    }
    return false;
  });

  const myChannels = channelList.filter((channel) => {
    if (channel.owner_id === currentUserId && !selectedChannels[channel.id]) {
      selectedChannels[channel.id] = true;
      return true;
    }
    return false;
  });

  const remainingChannels = channelList.filter(
    (channel) => !selectedChannels[channel.id]
  );

  const combineChannels = [...preferred, ...myChannels, ...remainingChannels];

  return combineChannels;
}
