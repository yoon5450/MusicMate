import supabase from "@/utils/supabase";

export const login = async (id: string, pass: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: id,
    password: pass,
  });

  if (error) console.log(error);
  else console.log("로그인 성공");
};

export async function getUserSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return ''
  }
  else return data
}
