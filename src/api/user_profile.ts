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
    errorHandler(error, "getUserProfile");
    return null;
  } else {
    return data;
  }
};
