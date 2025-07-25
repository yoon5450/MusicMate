import type { Tables } from "@/@types/database.types";
import S from "../Mypage.module.css";
import { useEffect, useId, useState } from "react";
import { updateUserProfileByUserId } from "@/api";
import logo from "@/assets/logo.svg";
import { updateUserAvatar } from "@/api/user_avatar";

interface Props {
  userInfo:
    | (Tables<"user_profile"> & {
        avatarFile: Blob | null;
        profilePreview: string | null;
      })
    | null;
  setProfileIsChanged: () => void;
}

function UserProfile({ userInfo, setProfileIsChanged }: Props) {
  const descriptionId = useId();
  const emailId = useId();
  const avatarId = useId();

  const [nickname, setNickName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<File | Blob | null>(null); // 이미지파일
  const [userAvatarPreview, setUserAvatarPreview] = useState<string | null>(
    null
  ); // 이미지프리뷰생성url

  useEffect(() => {
    if (userInfo) {
      setNickName(userInfo.nickname);
      setDescription(userInfo.description);
      setUserAvatarPreview(userInfo.profilePreview);
      setUserAvatar(userInfo.avatarFile);
    }
  }, [userInfo]);

  if (!userInfo) return;

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userAvatarUrl = { path: "" }; // supabase스토리지에 저장된 파일명(유저아이디/profile.확장자)

    if (userAvatar) {
      if (userAvatar instanceof File) {
        const fileExt = userAvatar.name.split(".").pop();
        const fileName = `${userInfo.id}/profile.${fileExt}`;
        const filePath = fileName;
        const data = await updateUserAvatar({
          filePath,
          userAvatar,
        });

        if (data) userAvatarUrl.path = data.path;
      } else {
        if (userInfo.profile_url) userAvatarUrl.path = userInfo.profile_url;
      }
    }

    const data = await updateUserProfileByUserId({
      ...userInfo,
      nickname,
      description,
      profile_url: userAvatarUrl.path,
    });

    console.log(data);

    if (!data) return;
    alert("변경되었습니다");
    setProfileIsChanged();
    return data;
  };

  return (
    <form className={S.editUserInfoForm} onSubmit={handleEditUser}>
      <div className={S.editUserAvatar}>
        <img
          src={userAvatarPreview ? userAvatarPreview : logo}
          alt="프로필이미지"
          className={S.userAvatar}
        />

        <label htmlFor={avatarId}>
          <div className={S.fileSelectButton}>파일선택하기</div>
        </label>
        <input
          id={avatarId}
          name={avatarId}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setUserAvatar(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setUserAvatarPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            } else {
              setUserAvatarPreview(null);
            }
          }}
        />
      </div>
      <div className={S.formInput}>
        <div className={S.formControl}>
          <label htmlFor={emailId}>닉네임</label>
          <input
            id={emailId}
            type="text"
            name="nickname"
            value={nickname ? nickname : ""}
            onChange={(e) => setNickName(e.target.value)}
            required
          />
        </div>
        <div className={S.formControl}>
          <label htmlFor={descriptionId}>설명</label>
          <textarea
            id={descriptionId}
            name="description"
            value={description ? description : undefined}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
      </div>
      <button type="submit">변경</button>
    </form>
  );
}

export default UserProfile;
