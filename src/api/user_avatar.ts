import errorHandler from "@/error/supabaseErrorHandler";
import supabase from "@/utils/supabase";

// export async function getAvatarUrl(
//   userAvatarPath: string
// ): Promise<Blob | null> {
//   const { data, error } = await supabase.storage
//     .from("user-avatar")
//     .download(userAvatarPath);
//   if (error) {
//     errorHandler(error, "getAvatarUrl");
//     return null;
//   } else {
//     return data;
//   }
// }

// 그냥 유저정보에 아바타url넣으면 퍼블릭url생성해줍니다........
export function getAvatarUrlPreview(userAvatarPath: string): string | null {
  const { data } = supabase.storage
    .from("user-avatar")
    .getPublicUrl(userAvatarPath);
  if (!data) return null;
  return `${data.publicUrl}`;
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
