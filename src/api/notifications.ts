import supabase from "@/utils/supabase";
import errorHandler from "@/error/supabaseErrorHandler";


export const getNotiByFeed = async (feedId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select()
    .eq("feed_id", feedId);

  if (error) {
    errorHandler(error, "getNotiByFeed");
    return null;
  } else {
    return data;
  }
};