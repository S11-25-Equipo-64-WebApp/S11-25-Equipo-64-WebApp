import { supabaseClient } from "@/lib/supabaseclient/supabase";

export const postUser = async (name: string, role: string) => {
  const { error } = await supabaseClient.from("users").insert({ name, role });

  if (error) {
    throw new Error(error.message);
  }

  return;
};
