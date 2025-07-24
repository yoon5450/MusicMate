import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

/**
 * @description 모든 유저 프로필을 조회합니다.
 * @returns {Promise<Tables<"user_profile">[] | null>} UserProfileData
 */
export const fetchAllUserProfile = async (): Promise<
  Tables<"user_profile">[] | null
> => {
  const { data, error } = await supabase.from("user_profile").select("*");

  if (error) {
    errorHandler(error, "getAllUserProfile");
    return null;
  } else {
    console.log(data);
    return data;
  }
};

/**
 * @description UID 기준한 유저 프로필을 조회합니다. 단일 요소지만 배열로 반환합니다.
 * @param uid
 * @returns {Promise<Tables<"user_profile">[] | null>} targetUserProfileData
 */
export const getUserProfileByUserId = async (
  uid: string
): Promise<Tables<"user_profile">[] | null> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select()
    .eq("id", uid);

  if (error) {
    errorHandler(error, "getUserProfileByUserId");
    return null;
  } else {
    return data;
  }
};

/**
 * @description 유저정보를 수정합니다
 * @param {Object} userInfo - 유저 정보 객체
 * @param {string|null} userInfo.nickname
 * @param {string|null} userInfo.profile_url
 * @param {string|null} userInfo.description
 * @param {string} userId - 유저 고유 아이디
 * @returns
 */
interface UserInfo {
  id: string;
  nickname: string;
  profile_url: string | null;
  description: string | null;
}
export const updateUserProfileByUserId = async ({
  id,
  nickname,
  profile_url,
  description,
}: UserInfo) => {
  const { data, error } = await supabase
    .from("user_profile")
    .update({ nickname, profile_url, description })
    .eq("id", id)
    .select();

  if (error) {
    errorHandler(error, "updateUserProfileByUserId");
    return null;
  } else {
    return data;
  }
};

type UserAvatarInfo = {
  filePath: string;
  userAvatar: File;
};

export const updateUserAvatar = async ({
  filePath,
  userAvatar,
}: UserAvatarInfo) => {
  const { data, error } = await supabase.storage
    .from("user-avatar")
    .upload(filePath, userAvatar, {
      upsert: true,
    });
  if (error) {
    errorHandler(error, "updateUserAvatar");
    return null;
  } else {
    return data;
  }
};
