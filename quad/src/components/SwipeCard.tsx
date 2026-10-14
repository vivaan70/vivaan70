import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { BadgeCheck, Info } from 'lucide-react';
import { useState } from 'react';
import type { Evaluation } from '../matching';
import type { Profile, SwipeAction } from '../types';
import { basicsPills } from '../profileText';
import { Photo } from './ui';

export type ExitDir = 'left' | 'right' | 'up';

const cardVariants = {
  enter: { scale: 0.94, y: 18, opacity: 0 },
  idle: (isTop: boolean) => ({ scale: isTop ? 1 : 0.94, y: isTop ? 0 : 18, opacity: 1 }),
  exit: (dir: ExitDir) => ({
    x: dir === 'left' ? -560 : dir === 'right' ? 560 : 0,
    y: dir === 'up' ? -900 : 40,
    opacity: 0,
    transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] as const },
  }),
};

const THRESHOLD = 110;

export function SwipeCard({
  profile,
  evaluation,
  isTop,
  onSwipe,
  onOpen,
}: {
  profile: Profile;
  evaluation: Evaluation;
  isTop: boolean;
  onSwipe: (a: SwipeAction) => void;
  onOpen: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-16, 16]);
  const likeOpacity = useTransform(x, [30, THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-THRESHOLD, -30], [1, 0]);
  const superOpacity = useTransform(y, [-THRESHOLD, -30], [1, 0]);
  const [page, setPage] = useState(0);

  const pages = [0, 1, 2];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -THRESHOLD * 1.2 && Math.abs(offset.x) < THRESHOLD) return onSwipe('super');
    if (offset.x > THRESHOLD || velocity.x > 700) return onSwipe('like');
    if (offset.x < -THRESHOLD || velocity.x < -700) return onSwipe('pass');
  };

  const tapPage = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const right = e.clientX - rect.left > rect.width / 2;
    setPage((p) => Math.max(0, Math.min(pages.length - 1, p + (right ? 1 : -1))));
  };

  const pills = basicsPills(profile);

  return (
    <motion.div
      className="card"
      style={{ x, y, rotate, zIndex: isTop ? 2 : 1 }}
      variants={cardVariants}
      custom={isTop}
      initial="enter"
      animate="idle"
      exit="exit"
      drag={isTop}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <Photo profile={profile} className="card-photo" />

      <div className="card-bars">
        {pages.map((i) => (
          <span key={i} className={i === page ? 'on' : ''} />
        ))}
      </div>

      <motion.div className="stamp stamp-like" style={{ opacity: likeOpacity }}>LIKE</motion.div>
      <motion.div className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>NOPE</motion.div>
      <motion.div className="stamp stamp-super" style={{ opacity: superOpacity }}>CRUSH</motion.div>

      <div className="card-tap" onClick={tapPage} />

      <div className="card-score">{evaluation.score}% match</div>

      <div className="card-info">
        <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {page === 0 && (
            <>
              {evaluation.reasons[0] && <div className="card-reason">✨ {evaluation.reasons[0]}</div>}
              <p className="card-bio">{profile.bio}</p>
            </>
          )}
          {page === 1 && profile.prompts[0] && (
            <div className="card-prompt">
              <span className="prompt-q">{profile.prompts[0].q}</span>
              <span className="prompt-a">{profile.prompts[0].a}</span>
            </div>
          )}
          {page === 2 && (
            <div className="pills">
              {pills.slice(0, 6).map((b) => (
                <span className="pill pill-glass" key={b.key}>{b.text}</span>
              ))}
            </div>
          )}
        </motion.div>
        <div className="card-name-row">
          <div>
            <h2>
              {profile.name} <span className="age">{profile.age}</span>
              {profile.verified && <BadgeCheck size={22} className="verified" aria-label="Verified student" />}
            </h2>
            <p className="card-sub">
              {profile.pronouns && <span className="pronoun-tag">{profile.pronouns}</span>}
              {profile.major} · {profile.year}
            </p>
          </div>
          <button
            className="icon-btn glass"
            aria-label={`More about ${profile.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
