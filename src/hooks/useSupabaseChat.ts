import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type Role = "user" | "assistant";

export interface Session {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMsg {
  id: string;
  session_id: string;
  role: Role;
  content: string;
  created_at: string;
}

export function useSupabaseChat(userId: string | null) {
  // ========== HOOKS DECLARATIONS (JANGAN UBAH URUTAN!) ==========
  const [sessions, setSessions] = useState<Session[]>([]);          // Hook 1
  const [activeId, setActiveId] = useState<string | null>(null);    // Hook 2
  const [messages, setMessages] = useState<ChatMsg[]>([]);          // Hook 3
  const [loading, setLoading] = useState(false);                    // Hook 4

  // Hook 5: useMemo
  const active = useMemo(() =>
    sessions.find(s => s.id === activeId) ?? null,
    [sessions, activeId]
  );

  // ========== LOAD SESSIONS ==========
  useEffect(() => {
    const loadSessions = async () => {
      if (!userId) {
        console.log('🔴 No userId, clearing sessions');
        setSessions([]);
        setActiveId(null);
        return;
      }

      console.log('🔍 Loading sessions for user:', userId);
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) {
          console.error('❌ Error loading sessions:', error);
        } else {
          console.log('✅ Sessions loaded:', data?.length || 0);
          setSessions(data as Session[]);

          // HAPUS AUTO-SELECT: Biarkan user pilih manual
          // if (!activeId && data?.length) {
          //   console.log('🎯 Auto-setting active session:', data[0].id);
          //   setActiveId(data[0].id);
          // }
        }
      } catch (err) {
        console.error('❌ Exception loading sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [userId]); // Hapus activeId dari dependencies

  // ========== LOAD MESSAGES ==========
  useEffect(() => {
    const loadMessages = async () => {
      if (!userId || !activeId) {
        console.log('🔴 No userId or activeId, clearing messages');
        setMessages([]);
        return;
      }

      console.log('📨 Loading messages for session:', activeId);

      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", activeId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error('❌ Error loading messages:', error);
        } else {
          console.log('✅ Messages loaded:', data?.length || 0);
          setMessages(data as ChatMsg[]);
        }
      } catch (err) {
        console.error('❌ Exception loading messages:', err);
      }
    };

    loadMessages();
  }, [userId, activeId]);

  // ========== CREATE SESSION ==========
  const createSession = async (title = "New chat"): Promise<string | null> => {
    if (!userId) {
      console.error('❌ Cannot create session: no userId');
      return null;
    }

    console.log('➕ Creating session:', title, 'for user:', userId);

    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          title,
          user_id: userId
        })
        .select("*")
        .single();

      if (error) {
        console.error('❌ Database error creating session:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        return null;
      }

      console.log('✅ Session created:', data.id);

      // Update local state
      setSessions(prev => [data as Session, ...prev]);
      setActiveId(data.id);

      return data.id;
    } catch (err) {
      console.error('❌ Exception creating session:', err);
      return null;
    }
  };

  // ========== RENAME SESSION ==========
  const renameSession = async (id: string, title: string): Promise<void> => {
    console.log('✏️ Renaming session:', id, '→', title);

    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error('❌ Error renaming session:', error);
        return;
      }

      setSessions(prev => prev.map(s => s.id === id ? data as Session : s));
    } catch (err) {
      console.error('❌ Exception renaming session:', err);
    }
  };

  // ========== DELETE SESSION ==========
  const deleteSession = async (id: string): Promise<void> => {
    console.log('🗑️ Deleting session:', id);

    try {
      // First delete all messages in this session
      const { error: msgError } = await supabase
        .from("chat_messages")
        .delete()
        .eq("session_id", id);

      if (msgError) {
        console.error('❌ Error deleting messages:', msgError);
      }

      // Then delete the session itself
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('❌ Error deleting session:', error);
        return;
      }

      console.log('✅ Session deleted from database:', id);

      // Update local state - use functional update to get fresh state
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== id);
        console.log('📋 Sessions after delete:', filtered.length);
        return filtered;
      });

      // Clear messages
      setMessages([]);

    } catch (err) {
      console.error('❌ Exception deleting session:', err);
    }
  };

  // ========== APPEND MESSAGE ==========
  const appendMessage = async (
    sessionId: string,
    role: Role,
    content: string
  ): Promise<string | null> => {
    console.log('💾 Appending message to DB:', {
      sessionId,
      role,
      contentPreview: content.substring(0, 50) + (content.length > 50 ? '...' : '')
    });

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role,
          content
        })
        .select("*")
        .single();

      if (error) {
        console.error('❌ Database error appending message:', error);
        return null;
      }

      const dbMessageId = data.id;
      console.log('✅ Message appended to DB. Database ID:', dbMessageId);

      // Update local messages state
      setMessages(prev => [...prev, data as ChatMsg]);

      // Update session timestamp
      try {
        await supabase
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        // Update local sessions state
        setSessions(prev =>
          prev.map(s => s.id === sessionId
            ? { ...s, updated_at: new Date().toISOString() }
            : s
          )
        );
      } catch (timestampError) {
        console.error('⚠️ Error updating session timestamp:', timestampError);
      }

      return dbMessageId;
    } catch (err) {
      console.error('❌ Exception appending message:', err);
      return null;
    }
  };

  // ========== UPDATE MESSAGE (FIXED VERSION) ==========
  const updateMessage = async (
    msgId: string,
    patch: Partial<Pick<ChatMsg, "content">>
  ): Promise<void> => {
    console.log('✏️ Updating message in DB:', {
      msgId,
      patchPreview: patch.content?.substring(0, 30) + (patch.content && patch.content.length > 30 ? '...' : '')
    });

    try {
      // ⭐ CRITICAL FIX: NO .select("*").single() for UPDATE operations
      const { error } = await supabase
        .from("chat_messages")
        .update(patch)
        .match({ id: msgId });

      if (error) {
        console.error('❌ Database error updating message:', error);
        console.error('Error details:', { msgId, patch, error });
        // Don't throw - just log and continue
        return;
      }

      console.log('✅ Message update successful for ID:', msgId);

      // Update local state for smooth UI
      setMessages(prev =>
        prev.map(msg =>
          msg.id === msgId
            ? { ...msg, ...patch }
            : msg
        )
      );
    } catch (err) {
      console.error('❌ Non-critical update error:', err);
      // Don't crash the app for update errors
    }
  };

  // ========== HAPUS AUTO-CREATE WELCOME SESSION ==========
  // HAPUS SELURUH BAGIAN INI:
  // useEffect(() => {
  //   const createWelcomeSession = async () => {
  //     if (userId && sessions.length === 0 && !loading) {
  //       console.log('🔄 No sessions found, creating welcome session...');
  //       const sessionId = await createSession("Welcome");
  //       
  //       if (sessionId) {
  //         console.log('✅ Welcome session created, adding welcome message...');
  //         // Add welcome message
  //         await appendMessage(
  //           sessionId, 
  //           "assistant", 
  //           "Hello! I'm your AI English Tutor. Type your message and I'll give grammar feedback and concise explanations."
  //         );
  //       }
  //     }
  //   };
  //
  //   createWelcomeSession();
  // }, [userId, sessions.length, loading]);

  // ========== RETURN OBJECT ==========
  return {
    // State
    sessions,
    active,
    activeId,
    setActiveId,
    messages,
    loading,

    // Functions
    createSession,
    renameSession,
    deleteSession,
    appendMessage,
    updateMessage,

    // Refresh functions (optional)
    refreshSessions: async () => {
      if (userId) {
        const { data } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });
        setSessions(data || []);
      }
    },

    refreshMessages: async () => {
      if (activeId) {
        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", activeId)
          .order("created_at", { ascending: true });
        setMessages(data || []);
      }
    }
  };
}