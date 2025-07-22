import supabase from "@/utils/supabase";

export const login = async (id: string, pass: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: id,
    password: pass,
  });

  if (error) console.log(error);
  else console.log("로그인 성공")
};
