import type { Tables } from "@/@types/database.types";
import errorHandler from "@/error/supabaseErrorHandler";
import supabase from "@/utils/supabase";


export type GenreType = Tables<"genres">;

export const getGenres = async (): Promise<GenreType[] | null> => {
  const {data,error} = await supabase.from("genres").select("*");

  if(error){
    errorHandler(error,"getGenre");
    return null;
  }
  return data;
}