import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

function getOrSetSessionId() {
  const KEY = 'adgenai-share-session';
  let id = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
  if (!id && typeof crypto !== 'undefined') {
    id = crypto.randomUUID();
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEY, id);
    }
  }
  return id;
}

interface TrackShareViewProps {
  page?: string;
  meta?: Record<string, any>;
}

export default function TrackShareView({
  page = 'share/adgenai',
  meta = {},
}: TrackShareViewProps) {
  useEffect(() => {
    const sid = getOrSetSessionId();
    const payload = {
      session_id: sid,
      page,
      meta,
      user_agent: navigator.userAgent,
      ts: new Date().toISOString(),
    };

    // de-dupe simple: only once per session per page
    const seenKey = `seen-${page}`;
    if (sessionStorage.getItem(seenKey)) return;
    sessionStorage.setItem(seenKey, '1');

    supabase.from('share_views').insert(payload).then(() => {
      console.log('📊 Share view tracked:', page);
    }).catch(error => {
      console.error('Share tracking error:', error);
    });
  }, [page, meta]);

  return null;
}