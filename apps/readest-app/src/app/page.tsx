'use client';

import { useAuth } from '@/context/AuthContext';
import Landing from './Landing';
import LibraryPage from './library/page';

// Root URL.
//   Anonymous visitors → public marketing landing.
//   Logged-in users   → straight to their library, same behaviour as before.
//
// AuthContext rehydrates from storage on the client, so during the brief
// initial paint `user` is null even for returning users. We accept that
// flash for now — the alternative (server-side session check) requires
// wiring Supabase SSR cookies through the Next.js middleware and we don't
// need it on day one.
export default function HomePage() {
  const { user } = useAuth();
  return user ? <LibraryPage /> : <Landing />;
}
