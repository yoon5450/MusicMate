// TODO: VIEW 생성해서 연결된 장르 이름과 함께 조회
/**
 * @description 현재 로그인한 사용자의 선호 장르 코드 목록을 가져옵니다.
 * @returns Promise<number[] | null> 선호장르배열, 실패 시 null
 */
import supabase from "@/utils/supabase";
import type { Tables } from "@/@types/database.types";
import errorHandler from "@/error/supabaseErrorHandler";

export type UserGenreType = Tables<"user_genres">;

export const getUserPreferredGenre = async (): Promise<number[] | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser(); //현재 로그인한 사용자 정보 가져오기

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_genres")
    .select("genre_code")
    .eq("user_id", user.id);

  if (error) {
    errorHandler(error, "getUserPreferredGenre");
    return null;
  }

  return data.map((item) => item.genre_code); //장르코드를 숫자 배열로 map 한 후 리턴하기
};

export const updateUserGenres = async ({
  selected_genres,
  user_id,
}: {
  user_id: string;
  selected_genres: number[];
}) => {
  const { data, error } = await supabase.rpc("update_user_genres", {
    selected_genres,
    user_id,
  });
  if (error) {
    errorHandler(error, "updateUserGenres");
    return null;
  }
  return data;
};
