import S from "./UserList.module.css";
import { useEffect, useRef, useState } from "react";
import type { Tables } from "@/@types/database.types";
import { getAvatarUrlPreview } from "@/api/user_avatar";
import { getChannelUserProFiles } from "@/api";

export type userProfileType = Tables<"user_profile">;

type Props = { channelId: string };

export const UserList = ({ channelId }: Props) => {
  const [users, setUsers] = useState<userProfileType[]>([]);

  useEffect(() => {
    if (!channelId) return;

    console.log("channelId ", channelId);
    
    async function fetchUsers() {
      const data = await getChannelUserProFiles(channelId);
      console.log("data == ", data);
      
      setUsers((data ?? []) as userProfileType[]);
    }

    fetchUsers();
  }, [channelId]);


  return (
    <div className={S.container}>
      <div className={S.searchBar}>
        <input type="text" placeholder="검색하기" onChange={handleChange} />
      </div>
      <div className={S.listWrapper}>
        <ul className={S.userList}>
          {users.map((user) => (
            <li key={user.id} className={S.userItem}>
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
