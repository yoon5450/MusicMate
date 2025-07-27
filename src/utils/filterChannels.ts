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
  channelList:ChannelsType[],
  preferredGenres: number[],
  currentUserId: string | null
):ChannelsType[] {
  if (!currentUserId || preferredGenres.length === 0) {
    return channelList;
  }

  const preferred = channelList.filter(
    (channel)=> preferredGenres.includes(channel.genre_code!)
  );

  const myChannels =  channelList.filter(
    (channel) => channel.owner_id === currentUserId
  );

  const combineChannels = [...preferred, ...myChannels];
  const showChannels = Array.from(new Map(combineChannels.map(item => [item.id, item])).values());

  return showChannels;
}