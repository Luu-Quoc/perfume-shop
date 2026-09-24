import { supabase } from "./supabase";
import type { Product } from "./types";

/**
 * Lấy tất cả sản phẩm đang được bán
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Lấy một sản phẩm theo ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    return null;
  }

  return data;
}
export async function searchProducts(keyword: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(
      `name.ilike.%${keyword}%,brand.ilike.%${keyword}%,description.ilike.%${keyword}%`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error);
    throw error;
  }

  return data ?? [];
}
export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("brand", brand)
    .order("name", { ascending: true });

  if (error) {
    console.error("Lỗi lọc thương hiệu:", error);
    throw error;
  }

  return data ?? [];
}
export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", category)
    .order("name", { ascending: true });

  if (error) {
    console.error("Lỗi lọc danh mục:", error);
    throw error;
  }

  return data ?? [];
}
