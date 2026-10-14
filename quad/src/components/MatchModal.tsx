import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import type { Mode, Profile } from '../types';
import { Photo } from './ui';

const COLORS = ['#a78bfa', '#f472b6', '#fb923c', '#facc15', '#34d399', '#60a5fa'];

const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 420,
  y: -(180 + Math.random() * 320),
  r: Math.random() * 540 - 270,
  c: COLORS[i % COLORS.length],
  d: Math.random() * 0.25,
}));

const COPY: Record<Mode, (name: string) => [string, string]> = {
  date: (n) => ["It's a match!", `You and ${n} liked each other.`],
  friends: (n) => ['New friend!', `You and ${n} both want to hang out.`],
  study: (n) => ['Study buddy!', `You and ${n} are ready to grind.`],
};

export function MatchModal({ me, them, mode, onChat, onClose }: { me: Profile; them: Profile | null; mode: Mode; onChat: () => void; onClose: () => void }) {

  return (
    <AnimatePresence>
      {them && (
        <motion.div className="match-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="confetti" aria-hidden>
            {CONFETTI.map((c) => (
              <motion.span
                key={c.id}
                style={{ background: c.c }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: c.x, y: [0, c.y, c.y + 520], rotate: c.r, opacity: [1, 1, 0] }}
                transition={{ duration: 2.2, delay: c.d, ease: 'easeOut' }}
              />
            ))}
          </div>
          <motion.div
            className="match-card"
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="match-title">{COPY[mode](them.name)[0]}</h1>
            <p className="muted">{COPY[mode](them.name)[1]}</p>
            <div className="match-photos">
              <motion.div initial={{ x: -60, rotate: -20 }} animate={{ x: 0, rotate: -8 }} transition={{ type: 'spring', delay: 0.1 }}>
                <Photo profile={me} size={120} className="round" />
              </motion.div>
              <motion.div initial={{ x: 60, rotate: 20 }} animate={{ x: 0, rotate: 8 }} transition={{ type: 'spring', delay: 0.1 }}>
                <Photo profile={them} size={120} className="round" />
              </motion.div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={onChat}>
              <MessageCircle size={18} /> Say hi
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onClose}>
              Keep swiping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
