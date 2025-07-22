import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

export type ChannelsType = Tables<"channels">
type InsertType = {
    description?: string | null;
    genre_code?: number | null;
    name: string;
    owner_id: string;
}

export const getChannels = async ():Promise<ChannelsType[] | null> => {
  const { data, error } = await supabase.from("channels").select("*");

  if (error) {
    errorHandler(error, "getChannels");
    return null;
  } else {
    return data;
  }
};

export const addChannels = async ({name, owner_id, description, genre_code}:InsertType) =>{
  const {data, error} = await supabase
  .from("channels")
  .insert({name, owner_id, description, genre_code})

  if (error) {
    errorHandler(error, "addChannels");
    return null;
  } else {
    return data;
  }
}