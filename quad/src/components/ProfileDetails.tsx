import { BadgeCheck, Flag, GraduationCap, Languages, ShieldOff } from 'lucide-react';
import { COMMUNITIES } from '../options';
import { basicsPills } from '../profileText';
import type { Profile } from '../types';
import { Photo } from './ui';

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>;
}


export function ProfileDetails({
  profile,
  score,
  reasons,
  onBlock,
}: {
  profile: Profile;
  score?: number;
  reasons?: string[];
  onBlock?: () => void;
}) {
  const p = profile;
  const communities = COMMUNITIES.filter((c) => p.communities.includes(c.id));
  return (
    <div className="details">
      <div className="details-hero">
        <Photo profile={p} className="details-photo" />
        <div className="details-hero-text">
          <h2>
            {p.name}, {p.age} {p.verified && <BadgeCheck size={20} className="verified" aria-label="Verified student" />}
          </h2>
          <p>
            {[p.pronouns, p.gender, p.showOrientation && p.orientation.length ? p.orientation.join(', ') : '']
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </div>

      <div className="details-row">
        <GraduationCap size={18} />
        <span>
          {p.year} · {p.major} · {p.university}
        </span>
      </div>

      {score !== undefined && (
        <div className="compat">
          <div className="compat-ring" style={{ '--p': score } as React.CSSProperties}>
            <span>{score}%</span>
          </div>
          <div>
            <strong>Compatibility</strong>
            <ul>
              {(reasons?.length ? reasons : ['Different vibes can be fun too']).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {p.bio && <p className="details-bio">{p.bio}</p>}

      {p.prompts.filter((x) => x.a).map((pr) => (
        <div className="prompt-card" key={pr.q}>
          <span className="prompt-q">{pr.q}</span>
          <span className="prompt-a">{pr.a}</span>
        </div>
      ))}

      <h3 className="details-h">Basics</h3>
      <div className="pills">
        {basicsPills(p).map((b) => (
          <Pill key={b.key}>{b.text}</Pill>
        ))}
      </div>

      {communities.length > 0 && (
        <>
          <h3 className="details-h">Communities</h3>
          <div className="pills">
            {communities.map((c) => (
              <Pill key={c.id}>
                {c.emoji} {c.label}
              </Pill>
            ))}
          </div>
        </>
      )}

      {p.interests.length > 0 && (
        <>
          <h3 className="details-h">Interests</h3>
          <div className="pills">
            {p.interests.map((i) => (
              <Pill key={i}>{i}</Pill>
            ))}
          </div>
        </>
      )}

      <div className="details-row">
        <Languages size={18} />
        <span>{p.languages.join(', ')}</span>
      </div>

      {onBlock && (
        <div className="safety-actions">
          <button className="btn btn-ghost" onClick={onBlock}>
            <ShieldOff size={16} /> Block {p.name}
          </button>
          <button className="btn btn-ghost danger" onClick={onBlock}>
            <Flag size={16} /> Report
          </button>
        </div>
      )}
    </div>
  );
}
