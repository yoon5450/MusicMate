import supabase from "@/utils/supabase";

export const getGenreUserProFiles = async (genreCode: number) => {
  const { data, error } = await supabase
    .from("view_genre_user_profiles")
    .select("*")
    .eq("genre_code", genreCode);

    if (error) throw error;

  return data;
};
