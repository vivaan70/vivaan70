import { emojiFor, labelFor } from './options';
import type { FilterKey, Profile } from './types';

/** Short emoji-prefixed labels for a profile's intentions, values and lifestyle. */
export function basicsPills(p: Profile) {
  const out: { key: string; text: string }[] = [];
  const add = (k: FilterKey, id: string, prefix = '') => {
    if (!id) return;
    const e = emojiFor(k, id);
    out.push({ key: `${k}-${id}`, text: `${e ? `${e} ` : prefix}${labelFor(k, id)}` });
  };
  p.intentions.forEach((i) => add('intentions', i));
  if (p.relationshipStyle) add('relationshipStyle', p.relationshipStyle, '🔗 ');
  if (p.religion && p.religion !== 'private') {
    const practice = p.faithPractice ? ` · ${labelFor('faithPractice', p.faithPractice).replace(' practicing', '')}` : '';
    out.push({ key: 'religion', text: `🙏 ${labelFor('religion', p.religion)}${practice}` });
  }
  p.pace.forEach((i) => add('pace', i));
  if (p.drinking) add('drinking', p.drinking, '🥂 ');
  if (p.smoking) add('smoking', p.smoking, '🚬 ');
  if (p.diet) add('diet', p.diet, '🍽️ ');
  if (p.kids) add('kids', p.kids, '👶 ');
  return out;
}
