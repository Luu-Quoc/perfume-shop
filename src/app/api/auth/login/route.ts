import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (
      !username ||
      !password ||
      username.length > 100 ||
      password.length > 256
    ) {
      return NextResponse.json(
        { error: "Vui lòng nhập tài khoản và mật khẩu." },
        { status: 400 },
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anonKey || !secretKey) {
      return NextResponse.json(
        { error: "Máy chủ chưa được cấu hình đầy đủ." },
        { status: 500 },
      );
    }

    const admin = createClient(url, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: profile, error: lookupError } = await admin
      .from("profiles")
      .select("email")
      .eq("username", username)
      .maybeSingle();

    if (lookupError || !profile?.email) {
      return NextResponse.json(
        { error: "Tài khoản hoặc mật khẩu không đúng." },
        { status: 401 },
      );
    }

    const authClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await authClient.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: "Tài khoản hoặc mật khẩu không đúng." },
        { status: 401 },
      );
    }

    return NextResponse.json({ session: data.session });
  } catch {
    return NextResponse.json(
      { error: "Không thể xử lý yêu cầu đăng nhập." },
      { status: 400 },
    );
  }
}
