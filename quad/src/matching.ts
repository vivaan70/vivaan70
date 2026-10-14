import { FILTER_OPTIONS, labelFor } from './options';
import type { FilterKey, Filters, Mode, Profile } from './types';

export interface Evaluation {
  visible: boolean;
  score: number;
  reasons: string[];
}

const FILTER_KEYS = Object.keys(FILTER_OPTIONS) as FilterKey[];

function valuesOf(p: Profile, key: FilterKey): string[] {
  const v = p[key];
  return Array.isArray(v) ? v : v ? [v] : [];
}

const overlap = <T,>(a: T[], b: T[]) => a.filter((x) => b.includes(x));

/**
 * Decide whether `them` should appear in `me`'s deck for `mode`, and how well they fit.
 * Every hard rule is mutual: their dealbreakers protect them just as yours protect you.
 */
export function evaluate(me: Profile, filters: Filters, them: Profile, mode: Mode): Evaluation {
  const hidden: Evaluation = { visible: false, score: 0, reasons: [] };

  if (!them.modes.includes(mode)) return hidden;
  if (filters.verifiedOnly && !them.verified) return hidden;
  if (filters.sameCampusOnly && them.university !== me.university) return hidden;

  if (mode === 'date') {
    if (!me.showMe.includes(them.genderGroup) || !them.showMe.includes(me.genderGroup)) return hidden;
    if (them.age < filters.ageMin || them.age > filters.ageMax) return hidden;
    if (me.age < them.ageMin || me.age > them.ageMax) return hidden;
    if ((me.sameFaithOnly || them.sameFaithOnly) && me.religion !== them.religion) return hidden;

    for (const key of FILTER_KEYS) {
      const rule = filters.rules[key];
      if (rule.dealbreaker && rule.values.length && !overlap(rule.values, valuesOf(them, key)).length) return hidden;
    }
  }

  let score = 52;
  const reasons: string[] = [];

  if (mode === 'date') {
    for (const key of FILTER_KEYS) {
      const rule = filters.rules[key];
      if (!rule.values.length) continue;
      if (overlap(rule.values, valuesOf(them, key)).length) score += 6;
    }
    const sharedIntent = overlap(me.intentions, them.intentions);
    if (sharedIntent.length) {
      score += 10;
      reasons.push(`Both looking for ${labelFor('intentions', sharedIntent[0]).toLowerCase()}`);
    } else {
      score -= 8;
    }
    if (me.religion === them.religion && !['private', 'other'].includes(me.religion)) {
      score += me.faithPractice === them.faithPractice ? 12 : 7;
      reasons.push(`Shared faith · ${labelFor('religion', me.religion)}`);
    }
    const sharedPace = overlap(me.pace, them.pace);
    if (sharedPace.length) {
      score += 4 * sharedPace.length;
      reasons.push(`Same pace · ${labelFor('pace', sharedPace[0]).toLowerCase()}`);
    }
    if (me.relationshipStyle === them.relationshipStyle) score += 4;
    if (me.kids === them.kids) score += 3;
  }

  const sharedInterests = overlap(me.interests, them.interests);
  score += Math.min(sharedInterests.length * 5, 20);
  if (sharedInterests.length) reasons.push(`Both into ${sharedInterests.slice(0, 2).join(' & ').toLowerCase()}`);

  const sharedLang = overlap(me.languages.filter((l) => l !== 'English'), them.languages);
  if (sharedLang.length) {
    score += 6;
    reasons.push(`You both speak ${sharedLang[0]}`);
  }

  const sharedCommunity = overlap(me.communities, them.communities);
  if (sharedCommunity.length) score += 4 * sharedCommunity.length;

  if (me.major === them.major) {
    score += mode === 'study' ? 15 : 3;
    const r = `Both studying ${me.major}`;
    if (mode === 'study') reasons.unshift(r);
    else reasons.push(r);
  }
  if (me.university === them.university) score += 3;

  return { visible: true, score: Math.max(40, Math.min(99, score)), reasons: reasons.slice(0, 3) };
}

export function emptyFilters(): Filters {
  const rules = Object.fromEntries(FILTER_KEYS.map((k) => [k, { values: [], dealbreaker: false }])) as unknown as Filters['rules'];
  return { ageMin: 18, ageMax: 30, sameCampusOnly: false, verifiedOnly: false, rules };
}

export function activeFilterCount(f: Filters): number {
  return (
    FILTER_KEYS.filter((k) => f.rules[k].values.length).length +
    (f.sameCampusOnly ? 1 : 0) +
    (f.verifiedOnly ? 1 : 0) +
    (f.ageMin !== 18 || f.ageMax !== 30 ? 1 : 0)
  );
}
