import { supabase } from "./supabase";

export type Profile = {
  id: string;
  full_name: string;
  username: string;
  phone: string;
  email: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}
