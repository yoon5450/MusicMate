import errorHandler from "@/error/supabaseErrorHandler";
import supabase from "@/utils/supabase";

export async function getAvatarUrl(
  userAvatarPath: string
): Promise<Blob | null> {
  const { data, error } = await supabase.storage
    .from("user-avatar")
    .download(userAvatarPath);
  if (error) {
    errorHandler(error, "getAvatarUrl");
    return null;
  } else {
    return data;
  }
}

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
