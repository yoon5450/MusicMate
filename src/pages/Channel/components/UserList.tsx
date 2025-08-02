import S from "./UserList.module.css";
import { useEffect, useRef, useState } from "react";
import type { Tables } from "@/@types/database.types";
import { getAvatarUrlPreview } from "@/api/user_avatar";
import { getChannelUserProFiles, getUserByNickname } from "@/api";
import { useRouter } from "@/router/RouterProvider";

export type userProfileType = Tables<"user_profile">;

type Props = { channelId: string };

export const UserList = ({ channelId }: Props) => {
  const [users, setUsers] = useState<userProfileType[]>([]); // 보여줄 유저 목록 (검색어o)
  const [channelUsers, setChannelUsers] = useState<userProfileType[]>([]); // 채널 전체 유저 목록
  const [searchText, setSearchText] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setHistoryRoute } = useRouter();

  // 채널 전체 유저 목록
  useEffect(() => {
    if (!channelId) return;

    async function fetchUsers() {
      const data = await getChannelUserProFiles(channelId);

      setUsers((data ?? []) as userProfileType[]);
      setChannelUsers((data ?? []) as userProfileType[]);
    }

    fetchUsers();
  }, [channelId]);

  // 검색 함수
  const handleSearch = async (text: string) => {
    if (!text) {
      // 1. 빈 문자열이면 채널 전체 유저를 보여줌
      setUsers(channelUsers);
      return;
    }
    // 2. 전체 유저 중 닉네임 검색
    const allMatchedUsers = await getUserByNickname(text);
    // 3. 채널 유저 id와 비교 (교집합)
    const channelUserIds = channelUsers.map((u) => u.id);
    const filtered = (allMatchedUsers ?? []).filter((user: userProfileType) =>
      channelUserIds.includes(user.id)
    );

    setUsers(filtered);
  };

  // input 값 변경 시 디바운스
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      handleSearch(value);
    }, 1000);
  };

  // 엔터키 눌렀을 때는 즉시 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timer.current) clearTimeout(timer.current);

      handleSearch(searchText);
    }
  };

  // 유저 프로필 클릭시
  const handleClick = (userId: string) => {
    window.history.pushState(null, "", `/user/${userId}`);
    setHistoryRoute(`/user/${userId}`);
  };

  return (
    <div className={S.container}>
      <div className={S.searchBar}>
        <input
          type="text"
          placeholder="검색하기"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={S.listWrapper}>
        <ul className={S.userList}>
          {users.map((user) => (
            <li
              key={user.id}
              className={S.userItem}
              onClick={() => handleClick(user.id)}
            >
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
