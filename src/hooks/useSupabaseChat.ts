import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type Role = "user" | "assistant";
export interface Session { id: string; title: string; created_at: string; updated_at: string; }
export interface ChatMsg { id: string; session_id: string; role: Role; content: string; created_at: string; }

export function useSupabaseChat(userId: string | null) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const active = useMemo(() => sessions.find(s => s.id===activeId) ?? null, [sessions, activeId]);

  // load sessions
  useEffect(() => {
    if (!userId) { setSessions([]); setActiveId(null); return; }
    (async () => {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) console.error(error);
      else {
        setSessions(data as any);
        if (!activeId && data?.length) setActiveId(data[0].id);
      }
    })();
  }, [userId]);

  // load messages when active changes
  useEffect(() => {
    if (!userId || !activeId) { setMessages([]); return; }
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeId)
        .order("created_at", { ascending: true });
      if (error) console.error(error);
      else setMessages(data as any);
    })();
  }, [userId, activeId]);

  async function createSession(title = "New chat") {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ title, user_id: userId })
      .select("*")
      .single();
    if (error) { console.error(error); return null; }
    setSessions(prev => [data as any, ...prev]);
    setActiveId((data as any).id);
    return (data as any).id as string;
  }

  async function renameSession(id: string, title: string) {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ title })
      .eq("id", id)
      .select("*")
      .single();
    if (error) { console.error(error); return; }
    setSessions(prev => prev.map(s => s.id===id ? data as any : s));
  }

  async function deleteSession(id: string) {
    const { error } = await supabase.from("chat_sessions").delete().eq("id", id);
    if (error) { console.error(error); return; }
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeId === id) setActiveId(sessions.find(s => s.id!==id)?.id ?? null);
    setMessages([]);
  }

  async function appendMessage(sessionId: string, role: Role, content: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ session_id: sessionId, user_id: userId, role, content })
      .select("*")
      .single();
    if (error) { console.error(error); return null; }
    setMessages(prev => [...prev, data as any]);
    await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
    setSessions(prev => prev.map(s => s.id===sessionId ? { ...s, updated_at: new Date().toISOString() } : s));
    return (data as any).id as string;
  }

  async function updateMessage(msgId: string, patch: Partial<Pick<ChatMsg, "content">>) {
    const { data, error } = await supabase
      .from("chat_messages")
      .update(patch)
      .eq("id", msgId)
      .select("*")
      .single();
    if (error) { console.error(error); return; }
    setMessages(prev => prev.map(m => m.id===msgId ? data as any : m));
  }

  return {
    sessions, active, activeId, setActiveId,
    createSession, renameSession, deleteSession,
    messages, appendMessage, updateMessage
  };
}
