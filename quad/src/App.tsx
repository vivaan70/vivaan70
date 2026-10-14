import { AnimatePresence, motion } from 'framer-motion';
import { Flame, MessageCircle, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Chat } from './components/Chat';
import { Discover } from './components/Discover';
import { MatchModal } from './components/MatchModal';
import { Matches } from './components/Matches';
import { Me } from './components/Me';
import { Onboarding } from './components/Onboarding';
import { useAppState } from './store';
import type { Profile } from './types';

type Tab = 'discover' | 'matches' | 'me';

const TABS: { id: Tab; label: string; Icon: typeof Flame }[] = [
  { id: 'discover', label: 'Discover', Icon: Flame },
  { id: 'matches', label: 'Matches', Icon: MessageCircle },
  { id: 'me', label: 'Profile', Icon: UserRound },
];

export default function App() {
  const store = useAppState();
  const { state, update } = store;
  const [tab, setTab] = useState<Tab>('discover');
  const [chatId, setChatId] = useState<string | null>(null);
  const [matched, setMatched] = useState<Profile | null>(null);

  if (!state.me) {
    return (
      <div className="app">
        <Onboarding
          onDone={(me) => {
            update({ me, mode: me.modes[0] });
            setTab('discover');
          }}
        />
      </div>
    );
  }

  const unread = state.matches.filter((id) => state.chats[id]?.at(-1)?.from === 'them').length;
  const newMatches = state.matches.filter((id) => !state.chats[id]?.length).length;

  return (
    <div className="app">
      <main className="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="tab-pane"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'discover' && <Discover store={store} onMatch={setMatched} />}
            {tab === 'matches' && <Matches store={store} openChat={setChatId} onMatch={setMatched} />}
            {tab === 'me' && <Me store={store} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="tab-bar">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} className={`tab ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)} aria-current={tab === id}>
            {tab === id && <motion.span layoutId="tab-glow" className="tab-glow" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            <span className="tab-icon">
              <Icon size={22} strokeWidth={tab === id ? 2.4 : 2} />
              {id === 'matches' && unread + newMatches > 0 && <span className="badge">{unread + newMatches}</span>}
            </span>
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>{chatId && <Chat key={chatId} store={store} id={chatId} onBack={() => setChatId(null)} />}</AnimatePresence>

      <MatchModal
        me={state.me}
        them={matched}
        mode={state.mode}
        onClose={() => setMatched(null)}
        onChat={() => {
          if (matched) setChatId(matched.id);
          setMatched(null);
          setTab('matches');
        }}
      />
      <div id="overlay-root" />
    </div>
  );
}
