import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  type StartAvatarRequest,
} from '@heygen/streaming-avatar';

export type HeygenAvatarHandle = {
  start: (opts?: Partial<StartAvatarRequest>) => Promise<void>;
  stop: () => Promise<void>;
  setMicMuted: (muted: boolean) => Promise<void>;
  speak: (text: string) => Promise<void>;
};

type Props = {
  muted?: boolean;
  className?: string;
  avatarName?: string;   // default Wayne_20240711
  voiceId?: string;
  knowledgeId?: string;
  quality?: AvatarQuality; // optional
};

const DEBUG = true; // set true biar semua log keluar

export const HeygenAvatar = forwardRef<HeygenAvatarHandle, Props>(function HeygenAvatar(
  { muted = false, className, avatarName, voiceId, knowledgeId, quality = AvatarQuality.High },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const basePath =
    (import.meta as any)?.env?.VITE_HEYGEN_BASE_API_URL || 'https://api.heygen.com';

  const log = (...args: any[]) => { if (DEBUG) console.log('[HEYGEN]', ...args); };

  const fetchToken = async (): Promise<string> => {
    const r = await fetch('/api/heygen/token');
    if (!r.ok) throw new Error(await r.text());
    const { token } = await r.json();
    if (!token) throw new Error('No token received');
    return token;
  };

  const start = async (opts: Partial<StartAvatarRequest> = {}) => {
    // Minta izin mic dulu (kadang Chrome ngambek soal autoplay/permission)
    try {
      const g = await navigator.mediaDevices.getUserMedia({ audio: true });
      g.getTracks().forEach(t => t.stop());
    } catch (e) {
      log('getUserMedia denied:', e);
    }

    const token = await fetchToken();
    log('Token OK, init StreamingAvatar. basePath=', basePath);
    const avatar = new StreamingAvatar({ token, basePath });
    (window as any).__avatar = avatar; // buat inspeksi manual di console
    avatarRef.current = avatar;

    // --- Events (bikin kelihatan kalau gagal di mana) ---
    avatar.on(StreamingEvents.STREAM_READY as any, (ev: any) => {
      const media: MediaStream | undefined =
        ev?.detail instanceof MediaStream ? ev.detail : ev?.detail?.stream;
      log('STREAM_READY detail=', ev?.detail, 'parsed media=', media);
      if (media) {
        setStream(media);
        log('Tracks:', media.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
      } else {
        log('STREAM_READY fired, but no MediaStream found in event.detail');
      }
    });

    avatar.on(StreamingEvents.STREAM_DISCONNECTED as any, () => {
      console.warn('[HEYGEN] STREAM_DISCONNECTED');
      setStream(null);
    });

    avatar.on('error' as any, (e: any) => {
      console.error('[HEYGEN] error event', e);
    });

    const req: StartAvatarRequest = {
      quality,
      avatarName: avatarName ?? 'Wayne_20240711',
      knowledgeId,
      voice: voiceId ? { voiceId } : undefined,
      ...opts,
    };

    log('createStartAvatar(req)=', req);
    const resp = await avatar.createStartAvatar(req);
    log('createStartAvatar resp=', resp);

    // Start voice chat (mic user -> avatar)
    await avatar.startVoiceChat({ isInputAudioMuted: false });
    log('startVoiceChat done');

    // TEST: paksa bicara 1 kalimat biar ada frame yang pasti gerak
    try {
      await avatar.speak({ text: 'Hello, I am your interactive avatar. If you can hear me, streaming works!' });
      log('speak test sent');
    } catch (e) {
      console.warn('speak failed', e);
    }
  };

  const stop = async () => {
    const a = avatarRef.current;
    if (!a) return;
    try { await a.closeVoiceChat(); log('closeVoiceChat done'); } catch (e) { log('closeVoiceChat err', e); }
    try { await a.stopAvatar(); log('stopAvatar done'); } catch (e) { log('stopAvatar err', e); }
    avatarRef.current = null;
    setStream(null);
  };

  const setMicMuted = async (muted: boolean) => {
    const a = avatarRef.current;
    if (!a) return;
    try { await a.closeVoiceChat(); } catch {}
    await a.startVoiceChat({ isInputAudioMuted: muted });
    log('restart voice chat with isInputAudioMuted=', muted);
  };

  const speak = async (text: string) => {
    if (!text?.trim()) return;
    await avatarRef.current?.speak({ text });
  };

  useImperativeHandle(ref, () => ({ start, stop, setMicMuted, speak }), []);

  useEffect(() => () => { void stop(); }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (stream) {
      v.srcObject = stream;
      const play = () => v.play().catch((e) => console.warn('video.play blocked', e));
      if (v.readyState >= 2) play(); else v.onloadedmetadata = play;
    } else {
      v.srcObject = null;
    }
  }, [stream, muted]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      // start muted biar autoplay aman; unmute via prop dari parent
      muted={true}
      className={className ?? 'w-full h-full rounded-xl'}
    />
  );
});
