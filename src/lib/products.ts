import { supabase } from "./supabase";
import { Product } from "./types";

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Product;
}

export async function searchProducts(
  search: string,
  occasion: string,
): Promise<Product[]> {
  let query = supabase.from("products").select("*");
  if (search) query = query.ilike("name", `%${search}%`);
  if (occasion) query = query.eq("occasion", occasion);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Product[];
}
