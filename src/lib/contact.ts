import { supabase } from "./supabase";

export async function submitContact(
  name: string,
  email: string,
  message: string,
) {
  const { error } = await supabase
    .from("contacts")
    .insert({ name, email, message });
  if (error) throw new Error(error.message);
}
