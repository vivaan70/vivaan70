export type GenderGroup = 'women' | 'men' | 'nonbinary';
export type Mode = 'date' | 'friends' | 'study';

export interface Prompt {
  q: string;
  a: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  gender: string;
  /** Which searches this person appears in. Chosen by the user, never inferred. */
  genderGroup: GenderGroup;
  orientation: string[];
  showOrientation: boolean;
  /** Who they want to see in Date mode. */
  showMe: GenderGroup[];
  ageMin: number;
  ageMax: number;
  university: string;
  year: string;
  major: string;
  bio: string;
  prompts: Prompt[];
  modes: Mode[];
  intentions: string[];
  relationshipStyle: string;
  religion: string;
  faithPractice: string;
  /** Hard requirement: only match with people who share this religion. */
  sameFaithOnly: boolean;
  pace: string[];
  drinking: string;
  smoking: string;
  diet: string;
  kids: string;
  languages: string[];
  interests: string[];
  communities: string[];
  verified: boolean;
  photo: { hue: number; emoji: string };
  /** Mock-only: whether this seeded profile has already liked the user. */
  likesYou?: boolean;
}

/** Filter keys that map 1:1 to a single-valued or multi-valued Profile field. */
export type FilterKey =
  | 'intentions'
  | 'relationshipStyle'
  | 'religion'
  | 'faithPractice'
  | 'pace'
  | 'drinking'
  | 'smoking'
  | 'diet'
  | 'kids';

export interface FilterRule {
  values: string[];
  /** Dealbreaker hides non-matches; otherwise matches just rank higher. */
  dealbreaker: boolean;
}

export interface Filters {
  ageMin: number;
  ageMax: number;
  sameCampusOnly: boolean;
  verifiedOnly: boolean;
  rules: Record<FilterKey, FilterRule>;
}

export interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: number;
}

export type SwipeAction = 'like' | 'pass' | 'super';

export interface Settings {
  theme: 'dark' | 'light';
  incognito: boolean;
  snoozed: boolean;
  /** In Date mode, matches can't message until you do. */
  iMessageFirst: boolean;
  hideFromCampusMates: boolean;
}
