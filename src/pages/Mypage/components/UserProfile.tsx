import type { Tables } from "@/@types/database.types";
import S from "../Mypage.module.css";
import { useEffect, useId, useState } from "react";
import { updateUserAvatar, updateUserProfileByUserId } from "@/api";
import logo from "@/assets/logo.svg";

interface Props {
  userInfo: Tables<"user_profile"> | null;
}

function UserProfile({ userInfo }: Props) {
  const descriptionId = useId();
  const emailId = useId();
  const avatarId = useId();

  const [nickname, setNickName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState<string | null>(
    null
  );

  const [editUserError, setEditUserError] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      setNickName(userInfo.nickname);
      setDescription(userInfo.description);
      setUserAvatarPreview(userInfo.profile_url);
    }
  }, [userInfo]);
  if (!userInfo) return;

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname) setEditUserError("⚠️닉네임은 필수입력값입니다⚠️");

    if (userAvatar) {
      // avatarFile.name 파일이름.확장자
      const fileExt = userAvatar.name.split(".").pop();
      setFileName(`${userInfo.id}.${fileExt}`);
      if (!fileName) return;
      const filePath = fileName;
      const data = await updateUserAvatar({ filePath, userAvatar });
      console.log(data);
    }

    const data = await updateUserProfileByUserId({
      ...userInfo,
      nickname,
      description,
      profile_url: userAvatarPreview,
    });

    console.log(data);

    if (!data) return;
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
        {editUserError ? <p>{editUserError}</p> : null}
        <div className={S.formControl}>
          <label htmlFor={emailId}>닉네임</label>
          <input
            id={emailId}
            type="text"
            name="nickname"
            value={nickname ? nickname : ""}
            onChange={(e) => setNickName(e.target.value)}
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
