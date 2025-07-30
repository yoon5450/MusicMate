import { getGenreUserProFiles } from "@/api/genre_user_profiles";
import S from "./UserList.module.css";
import { useEffect, useState } from "react";
import type { Tables } from "@/@types/database.types";
import { getGenreCodeByChannelId } from "@/api/genres";
import { getAvatarUrlPreview } from "@/api/user_avatar";

export type GenreUserProfilesType = Tables<"view_genre_user_profiles">;

type Props = { channelId: string };

export const UserList = ({ channelId }: Props) => {
  const [users, setUsers] = useState<GenreUserProfilesType[]>([]);

  const [genreCode, setGenreCode] = useState<number>(1);

  useEffect(() => {
    async function fetchGenreCode() {
      const data = await getGenreCodeByChannelId(channelId);
      if (data?.genre_code) setGenreCode(data?.genre_code);
    }

    fetchGenreCode();
  }, [channelId]);

  useEffect(() => {
    if (!genreCode) return;

    async function fetchUsers() {
      const data = await getGenreUserProFiles(genreCode);
      setUsers(data ?? []);
    }

    fetchUsers();
  }, [genreCode]);

  return (
    <div className={S.container}>
      <div className={S.searchBar}>
        <input type="text" placeholder="검색하기" />
      </div>
      <div className={S.listWrapper}>
        <ul className={S.userList}>
          {users.map((user) => (
            <li key={user.user_id} className={S.userItem}>
              <img
                className={S.avatar}
                src={
                  user.profile_url
                    ? getAvatarUrlPreview(user.profile_url)!
                    : "/music_mate_symbol_fixed.svg"
                }
                alt="유저이미지"
              />
              <span className={S.username}>{user.nickname}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
