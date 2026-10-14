import { motion } from 'framer-motion';
import { BadgeCheck, ChevronRight, Eye, LifeBuoy, LogOut, Moon, ShieldCheck } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import type { Store } from '../store';
import type { Profile, Settings } from '../types';
import {
  AboutSection, BasicsSection, FaithSection, IdentitySection, IntentionsSection, LifestyleSection,
  PreferencesSection, type SectionProps,
} from './ProfileFields';
import { ProfileDetails } from './ProfileDetails';
import { Photo, Sheet, Toggle } from './ui';

const SECTIONS: { id: string; title: string; emoji: string; Body: ComponentType<SectionProps> }[] = [
  { id: 'basics', title: 'Basics', emoji: '🎓', Body: BasicsSection },
  { id: 'identity', title: 'Identity', emoji: '🌈', Body: IdentitySection },
  { id: 'prefs', title: 'Modes & who you see', emoji: '💘', Body: PreferencesSection },
  { id: 'intent', title: 'Intentions & pace', emoji: '🧭', Body: IntentionsSection },
  { id: 'faith', title: 'Faith & beliefs', emoji: '🙏', Body: FaithSection },
  { id: 'life', title: 'Lifestyle', emoji: '🌿', Body: LifestyleSection },
  { id: 'about', title: 'Bio, prompts & interests', emoji: '✍️', Body: AboutSection },
];

function completeness(p: Profile): number {
  const checks = [
    p.bio, p.prompts.some((x) => x.a), p.interests.length >= 3, p.intentions.length, p.religion, p.drinking,
    p.diet, p.kids, p.major, p.year, p.pronouns,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function Me({ store }: { store: Store }) {
  const { state, update, reset } = store;
  const me = state.me!;
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const section = SECTIONS.find((s) => s.id === editing);
  const set = (patch: Partial<Profile>) => update((s) => ({ me: { ...s.me!, ...patch } }));
  const setSetting = (patch: Partial<Settings>) => update((s) => ({ settings: { ...s.settings, ...patch } }));
  const pct = completeness(me);

  return (
    <div className="screen me">
      <header className="page-head">
        <h1>Profile</h1>
      </header>
      <div className="me-scroll">
        <div className="me-hero">
          <div className="me-ring" style={{ '--p': pct } as React.CSSProperties}>
            <Photo profile={me} size={112} className="round" />
          </div>
          <h2>
            {me.name}, {me.age} <BadgeCheck size={20} className="verified" />
          </h2>
          <p className="muted">
            {me.year} · {me.major || 'Undeclared'} · {me.university}
          </p>
          <p className="completeness">Profile {pct}% complete</p>
          <motion.button whileTap={{ scale: 0.97 }} className="btn btn-ghost" onClick={() => setPreview(true)}>
            <Eye size={16} /> Preview my profile
          </motion.button>
        </div>

        <h3 className="section-h">Edit profile</h3>
        <ul className="list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button className="list-item" onClick={() => setEditing(s.id)}>
                <span className="list-emoji">{s.emoji}</span>
                <span>{s.title}</span>
                <ChevronRight size={18} className="muted" />
              </button>
            </li>
          ))}
        </ul>

        <h3 className="section-h">Privacy & safety</h3>
        <div className="card-panel">
          <Toggle checked={state.settings.incognito} onChange={(v) => setSetting({ incognito: v })} label="Incognito" hint="Only people you like can see you" />
          <Toggle checked={state.settings.snoozed} onChange={(v) => setSetting({ snoozed: v })} label="Snooze" hint="Take a break without losing matches" />
          <Toggle checked={state.settings.iMessageFirst} onChange={(v) => setSetting({ iMessageFirst: v })} label="I message first" hint="Matches can't start the chat" />
          <Toggle
            checked={state.settings.hideFromCampusMates}
            onChange={(v) => setSetting({ hideFromCampusMates: v })}
            label="Hide from my major"
            hint="Don't show me to people in my program"
          />
        </div>

        <h3 className="section-h">App</h3>
        <div className="card-panel">
          <Toggle
            checked={state.settings.theme === 'dark'}
            onChange={(v) => setSetting({ theme: v ? 'dark' : 'light' })}
            label={
              <>
                <Moon size={16} /> Dark mode
              </>
            }
          />
        </div>

        <ul className="list">
          <li>
            <a className="list-item" href="#safety" onClick={(e) => e.preventDefault()}>
              <span className="list-emoji"><ShieldCheck size={18} /></span>
              <span>Safety centre & campus resources</span>
              <ChevronRight size={18} className="muted" />
            </a>
          </li>
          <li>
            <a className="list-item" href="#help" onClick={(e) => e.preventDefault()}>
              <span className="list-emoji"><LifeBuoy size={18} /></span>
              <span>Help & feedback</span>
              <ChevronRight size={18} className="muted" />
            </a>
          </li>
          <li>
            <button
              className="list-item danger"
              onClick={() => {
                if (confirm('Reset Quad? This clears your profile, matches and chats on this device.')) reset();
              }}
            >
              <span className="list-emoji"><LogOut size={18} /></span>
              <span>Log out & reset demo</span>
            </button>
          </li>
        </ul>
      </div>

      <Sheet open={!!section} onClose={() => setEditing(null)} title={section?.title}>
        {section && <section.Body draft={me} set={set} />}
        <div className="sheet-foot">
          <button className="btn btn-primary" onClick={() => setEditing(null)}>
            Done
          </button>
        </div>
      </Sheet>

      <Sheet open={preview} onClose={() => setPreview(false)} title="How others see you">
        <ProfileDetails profile={me} />
      </Sheet>
    </div>
  );
}
