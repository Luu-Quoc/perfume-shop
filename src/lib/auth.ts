import { supabase } from "./supabase";

type RegisterInput = {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
};

export async function registerUser({
  fullName,
  username,
  phone,
  email,
  password,
}: RegisterInput) {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) throw new Error(signUpError.message);

  // Đăng nhập tường minh ngay sau đăng ký, đảm bảo có session thật
  // trước khi insert vào profiles (tránh lỗi RLS do session chưa kịp thiết lập)
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (signInError) throw new Error(signInError.message);

  const userId = signInData.user?.id;
  if (!userId) throw new Error("Không lấy được ID người dùng, thử lại sau.");

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: fullName,
    username,
    phone,
    email,
  });

  if (profileError) {
    throw new Error(
      profileError.message.includes("duplicate")
        ? "Tên tài khoản đã được sử dụng, vui lòng chọn tên khác."
        : profileError.message,
    );
  }

  return signInData;
}

export async function loginWithUsername(username: string, password: string) {
  const { data: email, error: lookupError } = await supabase.rpc(
    "get_email_by_username",
    {
      input_username: username,
    },
  );

  if (lookupError || !email) {
    throw new Error("Tài khoản không tồn tại.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Sai mật khẩu, vui lòng thử lại.");
}

export async function signInWithProvider(provider: "google" | "facebook") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw new Error(error.message);
}

// Tự động tạo hồ sơ (profiles) cho user đăng nhập qua Google/Facebook lần đầu,
// vì họ không đi qua form đăng ký nên chưa có dòng nào trong bảng profiles.
export async function ensureProfile(user: {
  id: string;
  email?: string;
  user_metadata?: any;
}) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return;

  const fallbackUsername =
    (user.email?.split("@")[0] || "user") + Math.floor(Math.random() * 10000);

  await supabase.from("profiles").insert({
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Người dùng mới",
    username: fallbackUsername,
    phone: "",
    email: user.email || "",
  });
}
