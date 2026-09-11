"use client";

import { useAuth } from "@/src/context/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Tài khoản của tôi</h1>
        <p>Email: {user?.email}</p>
      </main>
    </ProtectedRoute>
  );
}
