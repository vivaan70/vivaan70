import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useState } from 'react';
import { evaluate } from '../matching';
import type { Store } from '../store';
import type { Profile } from '../types';
import { ProfileDetails } from './ProfileDetails';
import { Photo, Sheet } from './ui';

export function Matches({ store, openChat, onMatch }: { store: Store; openChat: (id: string) => void; onMatch: (p: Profile) => void }) {
  const { state, profiles, swipe, block } = store;
  const me = state.me!;
  const [preview, setPreview] = useState<Profile | null>(null);

  const byId = new Map(profiles.map((p) => [p.id, p]));
  // Likes are romantic interest, so they must pass the mutual Date-mode checks.
  const likesYou = me.modes.includes('date')
    ? profiles.filter((p) => p.likesYou && !state.swipes[p.id] && evaluate(me, state.filters, p, 'date').visible)
    : [];
  const matched = state.matches.map((id) => byId.get(id)).filter((p): p is Profile => !!p);
  const fresh = matched.filter((p) => !state.chats[p.id]?.length);
  const convos = matched
    .filter((p) => state.chats[p.id]?.length)
    .sort((a, b) => state.chats[b.id].at(-1)!.at - state.chats[a.id].at(-1)!.at);

  return (
    <div className="screen matches">
      <header className="page-head">
        <h1>Matches</h1>
      </header>

      <div className="matches-scroll">
        {likesYou.length > 0 && (
          <section>
            <h3 className="section-h">
              Likes you <span className="count">{likesYou.length}</span>
            </h3>
            <div className="h-scroll">
              {likesYou.map((p) => (
                <motion.button whileTap={{ scale: 0.95 }} key={p.id} className="like-tile" onClick={() => setPreview(p)}>
                  <Photo profile={p} className="like-photo" />
                  <span className="like-name">{p.name}</span>
                  <span className="like-heart"><Heart size={12} fill="currentColor" /></span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="section-h">New matches</h3>
          {fresh.length ? (
            <div className="h-scroll">
              {fresh.map((p) => (
                <motion.button whileTap={{ scale: 0.95 }} key={p.id} className="match-bubble" onClick={() => openChat(p.id)}>
                  <Photo profile={p} size={72} className="round ring" />
                  <span>{p.name}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="muted small">Matches you haven't messaged will show up here.</p>
          )}
        </section>

        <section>
          <h3 className="section-h">Messages</h3>
          {convos.length === 0 && <p className="muted small">No conversations yet. Be the one to say hi 👋</p>}
          <ul className="convo-list">
            {convos.map((p) => {
              const last = state.chats[p.id].at(-1)!;
              return (
                <motion.li layout key={p.id}>
                  <button className="convo" onClick={() => openChat(p.id)}>
                    <Photo profile={p} size={56} className="round" />
                    <span className="convo-text">
                      <span className="convo-name">{p.name}</span>
                      <span className={`convo-last ${last.from === 'them' ? 'unread' : ''}`}>
                        {last.from === 'me' ? 'You: ' : ''}
                        {last.text}
                      </span>
                    </span>
                    {last.from === 'them' && <span className="dot" />}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </section>
      </div>

      <Sheet open={!!preview} onClose={() => setPreview(null)} title={preview ? `${preview.name} likes you` : ''}>
        {preview && (
          <>
            <ProfileDetails
              profile={preview}
              onBlock={() => {
                block(preview.id);
                setPreview(null);
              }}
            />
            <div className="sheet-foot sticky">
              <button
                className="action action-pass"
                aria-label="Pass"
                onClick={() => {
                  swipe(preview, 'pass');
                  setPreview(null);
                }}
              >
                <X size={28} />
              </button>
              <button
                className="action action-like"
                aria-label="Like back"
                onClick={() => {
                  swipe(preview, 'like');
                  setPreview(null);
                  onMatch(preview);
                }}
              >
                <Heart size={28} fill="currentColor" />
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
