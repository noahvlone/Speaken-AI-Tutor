// components/DatabaseTest.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function DatabaseTest() {
  const [status, setStatus] = useState('Testing...');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // 1. Test auth connection
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
        
        if (user) {
          setStatus(`✅ User: ${user.email}`);
          
          // 2. Test sessions table
          const { data: sessions, error: sessionsError } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .limit(1);
          
          if (sessionsError) {
            setStatus(`❌ Sessions error: ${sessionsError.message}`);
          } else {
            setStatus(`✅ Connected! Found ${sessions?.length || 0} sessions`);
          }
          
          // 3. Test insert (create test session)
          const { data: newSession, error: insertError } = await supabase
            .from('chat_sessions')
            .insert({ 
              user_id: user.id, 
              title: 'Test Session' 
            })
            .select()
            .single();
            
          if (insertError) {
            setStatus(`❌ Insert error: ${insertError.message}`);
          } else {
            setStatus(`✅ Insert successful! Session ID: ${newSession.id}`);
            
            // 4. Test message insert
            const { error: msgError } = await supabase
              .from('chat_messages')
              .insert({
                session_id: newSession.id,
                role: 'user',
                content: 'Test message'
              });
              
            if (msgError) {
              setStatus(`❌ Message error: ${msgError.message}`);
            } else {
              setStatus(`✅ Full test PASSED! Database is working.`);
            }
          }
        } else {
          setStatus('⚠️ Please log in first');
        }
      } catch (error) {
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h2>Database Test</h2>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User ID:</strong> {userId ? userId.substring(0, 20) + '...' : 'Not logged in'}</p>
        <p><strong>Tables:</strong> chat_sessions, chat_messages, user_progress, user_stats</p>
      </div>
    </div>
  );
}