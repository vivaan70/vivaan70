import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Heart, Lock, Sparkles, Users } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { UNIVERSITIES } from '../options';
import type { Profile } from '../types';
import {
  AboutSection, BasicsSection, FaithSection, IdentitySection, IntentionsSection, LifestyleSection,
  PreferencesSection, type SectionProps,
} from './ProfileFields';

const blank: Profile = {
  id: 'me', name: '', age: 0, pronouns: '', gender: '', genderGroup: 'women', orientation: [],
  showOrientation: true, showMe: ['women', 'men', 'nonbinary'], ageMin: 18, ageMax: 30,
  university: UNIVERSITIES[0], year: '', major: '', bio: '', prompts: [], modes: ['date', 'friends', 'study'],
  intentions: [], relationshipStyle: '', religion: '', faithPractice: '', sameFaithOnly: false, pace: [],
  drinking: '', smoking: '', diet: '', kids: '', languages: ['English'], interests: [], communities: [],
  verified: true, photo: { hue: 268, emoji: '😊' },
};

interface Step {
  title: string;
  sub: string;
  Body: ComponentType<SectionProps>;
  valid?: (p: Profile) => boolean;
  optional?: boolean;
}

const STEPS: Step[] = [
  { title: 'The basics', sub: 'Just enough to get you started.', Body: BasicsSection, valid: (p) => p.name.trim().length > 0 && p.age >= 18 },
  { title: 'Who you are', sub: 'Be exactly yourself. Everything here is editable later.', Body: IdentitySection, valid: (p) => p.gender.trim().length > 0 },
  { title: "What you're into", sub: 'Date, make friends, find a study buddy — or all three.', Body: PreferencesSection },
  { title: 'Intentions', sub: 'No guessing games. Say what you want.', Body: IntentionsSection, optional: true },
  { title: 'Faith & beliefs', sub: "Share as much or as little as you'd like.", Body: FaithSection, optional: true },
  { title: 'Lifestyle', sub: 'The little things that end up mattering.', Body: LifestyleSection, optional: true },
  { title: 'Show your vibe', sub: 'Prompts get 3× more conversations than bios.', Body: AboutSection, optional: true },
];

const EMOJIS = ['😊', '😎', '🌸', '🎧', '📚', '🌙', '🔥', '🦋', '🍓', '🌊', '🎨', '⚡️'];

export function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [stage, setStage] = useState<'welcome' | 'verify' | 'steps' | 'photo'>('welcome');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<Profile>(blank);
  const set = (patch: Partial<Profile>) => setDraft((d) => ({ ...d, ...patch }));

  const eduOk = /^[^\s@]+@[^\s@]+\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/i.test(email.trim());

  if (stage === 'welcome') {
    return (
      <div className="screen welcome">
        <div className="welcome-orbs" aria-hidden>
          <span /><span /><span />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="welcome-inner">
          <div className="logo-mark"><Heart size={30} fill="currentColor" /></div>
          <h1 className="welcome-title">quad</h1>
          <p className="welcome-sub">Dating, friends &amp; study buddies — just for your campus.</p>
          <ul className="welcome-points">
            <li><BadgeCheck size={18} /> Verified students only</li>
            <li><Users size={18} /> Every identity, every faith, every pace</li>
            <li><Lock size={18} /> Your dealbreakers are respected both ways</li>
          </ul>
          <motion.button whileTap={{ scale: 0.97 }} className="btn btn-primary btn-lg" onClick={() => setStage('verify')}>
            Get started
          </motion.button>
          <p className="fine">By continuing you agree to be kind. Seriously.</p>
        </motion.div>
      </div>
    );
  }

  if (stage === 'verify') {
    return (
      <div className="screen onboard">
        <header className="onboard-head">
          <button className="icon-btn" onClick={() => setStage('welcome')} aria-label="Back"><ArrowLeft size={20} /></button>
        </header>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="onboard-body">
          <h1>Verify you're a student</h1>
          <p className="muted">Use your university email. We only use it to confirm you're enrolled — it's never shown on your profile.</p>
          <input className="input input-lg" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          {codeSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <p className="muted small mt">We sent a 6-digit code to {email}. (Demo: any 6 digits works.)</p>
              <input
                className="input input-lg code-input"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </motion.div>
          )}
        </motion.div>
        <footer className="onboard-foot">
          {!codeSent ? (
            <button className="btn btn-primary btn-lg" disabled={!eduOk} onClick={() => setCodeSent(true)}>
              Send code
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" disabled={code.length !== 6} onClick={() => setStage('steps')}>
              Verify
            </button>
          )}
          {!eduOk && email.length > 4 && <p className="fine">Needs to be a .edu or .ac address</p>}
        </footer>
      </div>
    );
  }

  if (stage === 'photo') {
    return (
      <div className="screen onboard">
        <header className="onboard-head">
          <button className="icon-btn" onClick={() => setStage('steps')} aria-label="Back"><ArrowLeft size={20} /></button>
        </header>
        <div className="onboard-body center">
          <h1>Pick your look</h1>
          <p className="muted">Photo uploads come later — for now pick a vibe.</p>
          <motion.div
            key={`${draft.photo.hue}${draft.photo.emoji}`}
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="photo photo-preview"
            style={{ '--h': draft.photo.hue } as React.CSSProperties}
          >
            <span className="photo-emoji">{draft.photo.emoji}</span>
          </motion.div>
          <div className="emoji-grid">
            {EMOJIS.map((e) => (
              <button key={e} className={`emoji-pick ${draft.photo.emoji === e ? 'on' : ''}`} onClick={() => set({ photo: { ...draft.photo, emoji: e } })}>
                {e}
              </button>
            ))}
          </div>
          <input
            type="range"
            className="hue-slider"
            min={0}
            max={359}
            value={draft.photo.hue}
            aria-label="Colour"
            onChange={(e) => set({ photo: { ...draft.photo, hue: +e.target.value } })}
          />
        </div>
        <footer className="onboard-foot">
          <motion.button whileTap={{ scale: 0.97 }} className="btn btn-primary btn-lg" onClick={() => onDone(draft)}>
            <Sparkles size={18} /> Start exploring
          </motion.button>
        </footer>
      </div>
    );
  }

  const current = STEPS[step];
  const canNext = current.valid ? current.valid(draft) : true;
  const go = (delta: number) => {
    setDir(delta);
    if (step + delta < 0) return setStage('verify');
    if (step + delta >= STEPS.length) return setStage('photo');
    setStep(step + delta);
  };

  return (
    <div className="screen onboard">
      <header className="onboard-head">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Back"><ArrowLeft size={20} /></button>
        <div className="progress">
          <motion.div className="progress-fill" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
        </div>
        {current.optional ? (
          <button className="link-btn" onClick={() => go(1)}>Skip</button>
        ) : (
          <span className="step-count">{step + 1}/{STEPS.length}</span>
        )}
      </header>
      <div className="onboard-scroll">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.22 }}
            className="onboard-body"
          >
            <h1>{current.title}</h1>
            <p className="muted">{current.sub}</p>
            <current.Body draft={draft} set={set} />
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="onboard-foot">
        <motion.button whileTap={{ scale: 0.97 }} className="btn btn-primary btn-lg" disabled={!canNext} onClick={() => go(1)}>
          Continue
        </motion.button>
      </footer>
    </div>
  );
}
