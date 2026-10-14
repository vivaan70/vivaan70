import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RotateCcw, SlidersHorizontal, Star, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { activeFilterCount, evaluate } from '../matching';
import { MODES } from '../options';
import type { Store } from '../store';
import type { Profile, SwipeAction } from '../types';
import { FiltersSheet } from './FiltersSheet';
import { ProfileDetails } from './ProfileDetails';
import { SwipeCard, type ExitDir } from './SwipeCard';
import { Sheet } from './ui';

const DIR: Record<SwipeAction, ExitDir> = { like: 'right', pass: 'left', super: 'up' };

export function Discover({ store, onMatch }: { store: Store; onMatch: (p: Profile) => void }) {
  const { state, update, swipe, undo, block, profiles } = store;
  const me = state.me!;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState<Profile | null>(null);
  const [exitDir, setExitDir] = useState<ExitDir>('right');
  const [last, setLast] = useState<string | null>(null);

  const ranked = useMemo(
    () =>
      profiles
        .map((p) => ({ p, e: evaluate(me, state.filters, p, state.mode) }))
        .filter((x) => x.e.visible)
        .sort((a, b) => b.e.score - a.e.score),
    [profiles, me, state.filters, state.mode],
  );
  const deck = ranked.filter((x) => !state.swipes[x.p.id]);
  const top = deck[0];

  const act = (action: SwipeAction) => {
    if (!top) return;
    setExitDir(DIR[action]);
    setLast(top.p.id);
    const matched = swipe(top.p, action);
    if (matched) window.setTimeout(() => onMatch(top.p), 320);
  };

  const detailEval = detail ? evaluate(me, state.filters, detail, state.mode) : null;
  const availableModes = MODES.filter((m) => me.modes.includes(m.id));
  const filterCount = activeFilterCount(state.filters);

  return (
    <div className="screen discover">
      <header className="top-bar">
        <div className="segmented" role="tablist">
          {availableModes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={state.mode === m.id}
              className={state.mode === m.id ? 'on' : ''}
              onClick={() => update({ mode: m.id })}
            >
              {state.mode === m.id && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="seg-label">
                {m.emoji} {m.label}
              </span>
            </button>
          ))}
        </div>
        <button className="icon-btn filter-btn" onClick={() => setFiltersOpen(true)} aria-label="Preferences">
          <SlidersHorizontal size={20} />
          {filterCount > 0 && <span className="badge">{filterCount}</span>}
        </button>
      </header>

      {(state.settings.snoozed || state.settings.incognito) && (
        <div className="banner">
          {state.settings.snoozed ? '😴 Snoozed — nobody new will see you.' : '🕶️ Incognito — only people you like can see you.'}
        </div>
      )}

      <div className="deck">
        <AnimatePresence custom={exitDir}>
          {deck
            .slice(0, 2)
            .reverse()
            .map(({ p, e }) => (
              <SwipeCard key={p.id} profile={p} evaluation={e} isTop={p.id === top?.p.id} onSwipe={act} onOpen={() => setDetail(p)} />
            ))}
        </AnimatePresence>

        {!top && (
          <motion.div className="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="empty-emoji">🌙</div>
            <h2>You're all caught up</h2>
            <p className="muted">
              {ranked.length === 0
                ? 'Nobody fits these preferences right now. Try loosening a dealbreaker.'
                : "That's everyone for now. New students join every day."}
            </p>
            <div className="empty-actions">
              <button className="btn btn-ghost" onClick={() => setFiltersOpen(true)}>
                Adjust preferences
              </button>
              {ranked.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    update((s) => ({
                      swipes: Object.fromEntries(Object.entries(s.swipes).filter(([, a]) => a !== 'pass')),
                    }))
                  }
                >
                  See passes again
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="actions">
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="action action-sm"
          aria-label="Undo"
          disabled={!last || !state.swipes[last] || state.matches.includes(last)}
          onClick={() => {
            if (last) undo(last);
            setLast(null);
          }}
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} className="action action-pass" aria-label="Pass" disabled={!top} onClick={() => act('pass')}>
          <X size={30} strokeWidth={2.6} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} className="action action-super" aria-label="Crush" disabled={!top} onClick={() => act('super')}>
          <Star size={22} fill="currentColor" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} className="action action-like" aria-label="Like" disabled={!top} onClick={() => act('like')}>
          <Heart size={30} fill="currentColor" />
        </motion.button>
      </div>

      <FiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={state.filters}
        onChange={(filters) => update({ filters })}
        resultCount={deck.length}
      />

      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail?.name}>
        {detail && (
          <ProfileDetails
            profile={detail}
            score={detailEval?.score}
            reasons={detailEval?.reasons}
            onBlock={() => {
              block(detail.id);
              setDetail(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}
