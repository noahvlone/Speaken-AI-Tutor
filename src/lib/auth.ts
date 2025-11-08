import { supabase } from "./supabaseClient";

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthState(callback: (userId: string|null)=>void) {
  // get initial
  const u = supabase.auth.getUser().then(({data}) => callback(data.user?.id ?? null));
  // subscribe
  return supabase.auth.onAuthStateChange((_e, session) => {
    callback(session?.user?.id ?? null);
  });
}
