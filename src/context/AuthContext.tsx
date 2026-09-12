"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/src/lib/supabase";
import { ensureProfile } from "@/src/lib/auth";
import { getProfile, Profile } from "@/src/lib/profile";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserAndProfile(currentUser: User | null) {
    setUser(currentUser);
    if (currentUser) {
      await ensureProfile(currentUser);
      const p = await getProfile(currentUser.id);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserAndProfile(session?.user ?? null).then(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        loadUserAndProfile(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
