import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Send, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Store } from '../store';
import type { Profile } from '../types';
import { ProfileDetails } from './ProfileDetails';
import { Photo, Sheet } from './ui';

function icebreakers(me: Profile, them: Profile): string[] {
  const shared = me.interests.filter((i) => them.interests.includes(i));
  const out: string[] = [];
  if (shared[0]) out.push(`Okay fellow ${shared[0].toLowerCase()} fan — what got you into it?`);
  if (them.prompts[0]) out.push(`"${them.prompts[0].a}" — okay I need the full story 😂`);
  out.push(`Best study spot at ${them.university.split(' ')[0]}? Go.`);
  out.push('Coffee, boba, or dining hall dessert run?');
  return out.slice(0, 3);
}

export function Chat({ store, id, onBack }: { store: Store; id: string; onBack: () => void }) {
  const { state, profiles, send, block } = store;
  const them = profiles.find((p) => p.id === id);
  const messages = state.chats[id] ?? [];
  const [text, setText] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const lastFromMe = messages.at(-1)?.from === 'me';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!them) return null;

  const submit = (t: string) => {
    const v = t.trim();
    if (!v) return;
    send(id, v);
    setText('');
  };

  return (
    <motion.div
      className="screen chat"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 40 }}
    >
      <header className="chat-head">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <button className="chat-who" onClick={() => setInfoOpen(true)}>
          <Photo profile={them} size={38} className="round" />
          <span>
            <span className="chat-name">{them.name}</span>
            <span className="chat-sub">{them.pronouns}</span>
          </span>
        </button>
        <button className="icon-btn" onClick={() => setInfoOpen(true)} aria-label="Profile and safety">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty">
            <Photo profile={them} size={96} className="round ring" />
            <p className="muted">You matched with {them.name}. Need an opener?</p>
            <div className="icebreakers">
              {icebreakers(state.me!, them).map((ib) => (
                <motion.button whileTap={{ scale: 0.97 }} key={ib} className="icebreaker" onClick={() => submit(ib)}>
                  {ib}
                </motion.button>
              ))}
            </div>
            <p className="safety-note">
              <ShieldCheck size={14} /> Meet in public on campus first, and tell a friend where you'll be.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              className={`bubble ${m.from}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            >
              {m.text}
            </motion.div>
          ))}
          {lastFromMe && (
            <motion.div key="typing" className="bubble them typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
              <span /><span /><span />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
      >
        <input className="input" placeholder={`Message ${them.name}…`} value={text} onChange={(e) => setText(e.target.value)} />
        <motion.button whileTap={{ scale: 0.9 }} className="send-btn" disabled={!text.trim()} aria-label="Send">
          <Send size={18} />
        </motion.button>
      </form>

      <Sheet open={infoOpen} onClose={() => setInfoOpen(false)} title={them.name}>
        <ProfileDetails
          profile={them}
          onBlock={() => {
            block(id);
            setInfoOpen(false);
            onBack();
          }}
        />
      </Sheet>
    </motion.div>
  );
}
