import type { ChannelsType } from "@/api/channels";


export function sortPreferenceChannel(
  channels: ChannelsType[] | null | undefined,
  preferredGenres: number[],
):ChannelsType[] {
  if(!channels?.length) return [];

//선호 장르가 있으면 filter, 없으면 전체 채널 정렬
 if(!preferredGenres.length) return channels;

 return channels.filter(c=> preferredGenres.includes(c.genre_code!));
}
