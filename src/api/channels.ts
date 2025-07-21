import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";

export const getChannels = async ():Promise<Tables<"channels">[] | null> => {
  const { data, error } = await supabase.from("channels").select("*");

  if (error) {
    errorHandler(error, "getAllChanels");
    return null;
  } else {
    return data;
  }
};

