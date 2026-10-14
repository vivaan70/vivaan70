import { useState } from 'react';
import {
  COMMUNITIES, FILTER_OPTIONS, GENDER_GROUPS, GENDERS, INTERESTS, LANGUAGES, MODES, ORIENTATIONS,
  PROMPT_QUESTIONS, PRONOUNS, UNIVERSITIES, YEARS,
} from '../options';
import type { FilterKey, GenderGroup, Mode, Profile } from '../types';
import { ChipGroup, Field, RangeSlider, Toggle } from './ui';

export interface SectionProps {
  draft: Profile;
  set: (patch: Partial<Profile>) => void;
}

/** Single-select chip group bound to a string field on the profile. */
function Single({ draft, set, k }: SectionProps & { k: Exclude<FilterKey, 'intentions' | 'pace'> }) {
  const value = draft[k];
  return (
    <ChipGroup
      options={FILTER_OPTIONS[k].options}
      value={value ? [value] : []}
      onChange={(v) => set({ [k]: v[0] ?? '' } as Partial<Profile>)}
    />
  );
}

export function BasicsSection({ draft, set }: SectionProps) {
  return (
    <>
      <Field label="First name">
        <input className="input" value={draft.name} placeholder="What should people call you?" maxLength={24} onChange={(e) => set({ name: e.target.value })} />
      </Field>
      <Field label="Age" hint="18+ only">
        <input
          className="input"
          type="number"
          inputMode="numeric"
          min={18}
          max={99}
          value={draft.age || ''}
          placeholder="20"
          onChange={(e) => set({ age: Math.max(0, Math.min(99, +e.target.value)) })}
        />
      </Field>
      <Field label="Campus">
        <select className="input" value={draft.university} onChange={(e) => set({ university: e.target.value })}>
          {UNIVERSITIES.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </Field>
      <Field label="Year">
        <ChipGroup options={YEARS} value={[draft.year]} onChange={(v) => set({ year: v[0] ?? '' })} />
      </Field>
      <Field label="Major / program">
        <input className="input" value={draft.major} placeholder="e.g. Computer Science" onChange={(e) => set({ major: e.target.value })} />
      </Field>
    </>
  );
}

export function IdentitySection({ draft, set }: SectionProps) {
  const known = GENDERS.some((g) => g.label === draft.gender && g.label !== 'Self-describe');
  const [custom, setCustom] = useState(!!draft.gender && !known);
  const [customPronoun, setCustomPronoun] = useState(!!draft.pronouns && !PRONOUNS.includes(draft.pronouns));

  return (
    <>
      <Field label="Gender">
        <ChipGroup
          options={GENDERS.map((g) => g.label)}
          value={custom ? ['Self-describe'] : [draft.gender]}
          onChange={(v) => {
            const label = v[0] ?? '';
            if (label === 'Self-describe') {
              setCustom(true);
              set({ gender: '' });
              return;
            }
            setCustom(false);
            const group = GENDERS.find((g) => g.label === label)?.group;
            set({ gender: label, ...(group ? { genderGroup: group } : {}) });
          }}
        />
        {custom && (
          <input className="input mt" autoFocus placeholder="Describe your gender in your words" value={draft.gender} maxLength={32} onChange={(e) => set({ gender: e.target.value })} />
        )}
      </Field>
      <Field label="Show me in searches for" hint="You decide — we never infer this">
        <ChipGroup options={GENDER_GROUPS} value={[draft.genderGroup]} onChange={(v) => v[0] && set({ genderGroup: v[0] as GenderGroup })} />
      </Field>
      <Field label="Pronouns">
        <ChipGroup
          options={[...PRONOUNS, 'custom']}
          value={customPronoun ? ['custom'] : [draft.pronouns]}
          onChange={(v) => {
            if (v[0] === 'custom') {
              setCustomPronoun(true);
              set({ pronouns: '' });
            } else {
              setCustomPronoun(false);
              set({ pronouns: v[0] ?? '' });
            }
          }}
        />
        {customPronoun && <input className="input mt" placeholder="e.g. fae/faer" value={draft.pronouns} maxLength={20} onChange={(e) => set({ pronouns: e.target.value })} />}
      </Field>
      <Field label="Sexuality" hint="Pick any that fit">
        <ChipGroup multi options={ORIENTATIONS} value={draft.orientation} onChange={(v) => set({ orientation: v })} />
        <Toggle checked={draft.showOrientation} onChange={(v) => set({ showOrientation: v })} label="Show on my profile" />
      </Field>
      <Field label="Communities" hint="Optional — only shown if you add them">
        <ChipGroup multi options={COMMUNITIES} value={draft.communities} onChange={(v) => set({ communities: v })} />
      </Field>
    </>
  );
}

export function PreferencesSection({ draft, set }: SectionProps) {
  return (
    <>
      <Field label="I'm here for" hint="Switch modes anytime">
        <div className="mode-cards">
          {MODES.map((m) => {
            const on = draft.modes.includes(m.id);
            return (
              <button
                type="button"
                key={m.id}
                className={`mode-card ${on ? 'on' : ''}`}
                onClick={() => {
                  const modes = on ? draft.modes.filter((x) => x !== m.id) : [...draft.modes, m.id];
                  if (modes.length) set({ modes: modes as Mode[] });
                }}
              >
                <span className="mode-emoji">{m.emoji}</span>
                <span className="mode-title">{m.label}</span>
                <span className="mode-blurb">{m.blurb}</span>
              </button>
            );
          })}
        </div>
      </Field>
      {draft.modes.includes('date') && (
        <>
          <Field label="Interested in dating" hint="Choose all that apply">
            <ChipGroup multi options={GENDER_GROUPS} value={draft.showMe} onChange={(v) => v.length && set({ showMe: v as GenderGroup[] })} />
          </Field>
          <Field label="Age range for dates">
            <RangeSlider min={18} max={35} low={draft.ageMin} high={draft.ageMax} onChange={(ageMin, ageMax) => set({ ageMin, ageMax })} />
          </Field>
        </>
      )}
    </>
  );
}

export function IntentionsSection({ draft, set }: SectionProps) {
  return (
    <>
      <Field label="Looking for">
        <ChipGroup multi options={FILTER_OPTIONS.intentions.options} value={draft.intentions} onChange={(v) => set({ intentions: v })} />
      </Field>
      <Field label="Relationship style">
        <Single draft={draft} set={set} k="relationshipStyle" />
      </Field>
      <Field label="Values & pace" hint="Optional — helps the right people find you">
        <ChipGroup multi options={FILTER_OPTIONS.pace.options} value={draft.pace} onChange={(v) => set({ pace: v })} />
      </Field>
    </>
  );
}

export function FaithSection({ draft, set }: SectionProps) {
  const sharing = draft.religion && draft.religion !== 'private';
  return (
    <>
      <Field label="Faith or worldview">
        <Single draft={draft} set={set} k="religion" />
      </Field>
      {sharing && (
        <>
          <Field label="How practicing are you?">
            <Single draft={draft} set={set} k="faithPractice" />
          </Field>
          <Toggle
            checked={draft.sameFaithOnly}
            onChange={(v) => set({ sameFaithOnly: v })}
            label="Only match with people who share my faith"
            hint="A hard filter, applied both ways"
          />
        </>
      )}
    </>
  );
}

export function LifestyleSection({ draft, set }: SectionProps) {
  return (
    <>
      {(['drinking', 'smoking', 'diet', 'kids'] as const).map((k) => (
        <Field key={k} label={FILTER_OPTIONS[k].title}>
          <Single draft={draft} set={set} k={k} />
        </Field>
      ))}
    </>
  );
}

export function AboutSection({ draft, set }: SectionProps) {
  const prompts = draft.prompts.length ? draft.prompts : [{ q: PROMPT_QUESTIONS[0], a: '' }, { q: PROMPT_QUESTIONS[1], a: '' }];
  const setPrompt = (i: number, patch: Partial<{ q: string; a: string }>) =>
    set({ prompts: prompts.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

  return (
    <>
      <Field label="Bio" hint={`${draft.bio.length}/200`}>
        <textarea className="input" rows={3} maxLength={200} value={draft.bio} placeholder="A little about you…" onChange={(e) => set({ bio: e.target.value })} />
      </Field>
      {prompts.map((p, i) => (
        <Field key={i} label={`Prompt ${i + 1}`}>
          <select className="input" value={p.q} onChange={(e) => setPrompt(i, { q: e.target.value })}>
            {PROMPT_QUESTIONS.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          <input className="input mt" value={p.a} maxLength={120} placeholder="Your answer" onChange={(e) => setPrompt(i, { a: e.target.value })} />
        </Field>
      ))}
      <Field label="Interests" hint={`${draft.interests.length}/6`}>
        <ChipGroup multi max={6} options={INTERESTS} value={draft.interests} onChange={(v) => set({ interests: v })} />
      </Field>
      <Field label="Languages">
        <ChipGroup multi options={LANGUAGES} value={draft.languages} onChange={(v) => set({ languages: v })} />
      </Field>
    </>
  );
}
