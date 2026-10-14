import { useCallback, useEffect, useState } from 'react';
import { SEED_PROFILES } from './data/profiles';
import { emptyFilters } from './matching';
import type { Filters, Message, Mode, Profile, Settings, SwipeAction } from './types';

const KEY = 'quad:v1';

export interface AppState {
  me: Profile | null;
  filters: Filters;
  mode: Mode;
  swipes: Record<string, SwipeAction>;
  matches: string[];
  chats: Record<string, Message[]>;
  blocked: string[];
  settings: Settings;
}

const initial = (): AppState => ({
  me: null,
  filters: emptyFilters(),
  mode: 'date',
  swipes: {},
  matches: [],
  chats: {},
  blocked: [],
  settings: { theme: 'dark', incognito: false, snoozed: false, iMessageFirst: false, hideFromCampusMates: false },
});

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const base = initial();
      return {
        ...base,
        ...parsed,
        filters: { ...base.filters, ...parsed.filters, rules: { ...base.filters.rules, ...parsed.filters?.rules } },
        settings: { ...base.settings, ...parsed.settings },
      };
    }
  } catch {
    /* storage unavailable — start fresh */
  }
  return initial();
}

const REPLIES = [
  'haha okay you have my attention 👀',
  'wait that is so true',
  'I was literally about to message you!',
  "ok but what's your go-to coffee spot on campus?",
  'lol no way. tell me more',
  'are you going to the thing at the student center friday?',
  'that made me laugh out loud in the library 😭',
];

export const uid = () => Math.random().toString(36).slice(2, 10);

export function useAppState() {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  const update = useCallback((patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  /** Returns true when the swipe created a new match. */
  const swipe = useCallback((profile: Profile, action: SwipeAction): boolean => {
    const isMatch = action !== 'pass' && (!!profile.likesYou || action === 'super');
    setState((s) => ({
      ...s,
      swipes: { ...s.swipes, [profile.id]: action },
      matches: isMatch && !s.matches.includes(profile.id) ? [profile.id, ...s.matches] : s.matches,
    }));
    return isMatch;
  }, []);

  const undo = useCallback((id: string) => {
    setState((s) => {
      const swipes = { ...s.swipes };
      delete swipes[id];
      return { ...s, swipes };
    });
  }, []);

  const send = useCallback((id: string, text: string) => {
    const msg: Message = { id: uid(), from: 'me', text, at: Date.now() };
    setState((s) => ({ ...s, chats: { ...s.chats, [id]: [...(s.chats[id] ?? []), msg] } }));
    window.setTimeout(() => {
      const reply: Message = {
        id: uid(),
        from: 'them',
        text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        at: Date.now(),
      };
      setState((s) => (s.blocked.includes(id) ? s : { ...s, chats: { ...s.chats, [id]: [...(s.chats[id] ?? []), reply] } }));
    }, 1400 + Math.random() * 1600);
  }, []);

  const block = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      blocked: [...s.blocked, id],
      matches: s.matches.filter((m) => m !== id),
    }));
  }, []);

  const reset = useCallback(() => setState(initial()), []);

  const profiles = SEED_PROFILES.filter((p) => !state.blocked.includes(p.id));

  return { state, update, swipe, undo, send, block, reset, profiles };
}

export type Store = ReturnType<typeof useAppState>;
