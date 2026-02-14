import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/instance';

/**
 * AuthCallback component handles the OAuth redirect from Supabase
 * It processes the auth tokens from URL hash and redirects to home
 */
export function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing login...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const supabase = createClient();

                // Check if we have hash params (OAuth returns tokens in hash)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    setStatus('Setting up session...');

                    // Set the session using the tokens from URL
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (error) {
                        console.error('❌ Error setting session:', error);
                        navigate('/login?error=session_error');
                        return;
                    }

                    if (data.session) {
                        console.log('✅ Session established successfully');
                        setStatus('Login successful! Redirecting...');

                        // Clear the hash from URL for security
                        window.history.replaceState(null, '', window.location.pathname);

                        // Redirect to home
                        setTimeout(() => {
                            navigate('/home', { replace: true });
                        }, 500);
                        return;
                    }
                }

                // If no tokens in hash, try to get existing session
                setStatus('Checking session...');
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Auth callback error:', error);
                    navigate('/login?error=auth_failed');
                    return;
                }

                if (session) {
                    console.log('✅ Existing session found');
                    navigate('/home', { replace: true });
                } else {
                    console.log('❌ No session found');
                    navigate('/login?error=no_session');
                }
            } catch (err) {
                console.error('❌ Unexpected auth callback error:', err);
                navigate('/login?error=unexpected');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600">{status}</p>
                <p className="text-sm text-gray-400 mt-2">Please wait...</p>
            </div>
        </div>
    );
}
