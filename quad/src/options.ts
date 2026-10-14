import type { FilterKey, GenderGroup, Mode } from './types';

export interface Opt {
  id: string;
  label: string;
  emoji?: string;
}

export const GENDERS: { label: string; group: GenderGroup | null }[] = [
  { label: 'Woman', group: 'women' },
  { label: 'Man', group: 'men' },
  { label: 'Non-binary', group: 'nonbinary' },
  { label: 'Trans woman', group: 'women' },
  { label: 'Trans man', group: 'men' },
  { label: 'Genderqueer', group: 'nonbinary' },
  { label: 'Genderfluid', group: 'nonbinary' },
  { label: 'Agender', group: 'nonbinary' },
  { label: 'Two-Spirit', group: 'nonbinary' },
  { label: 'Questioning', group: null },
  { label: 'Self-describe', group: null },
];

export const GENDER_GROUPS: Opt[] = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'nonbinary', label: 'Non-binary people' },
];

export const PRONOUNS = ['she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'xe/xem', 'any pronouns', 'ask me'];

export const ORIENTATIONS = [
  'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer', 'Asexual',
  'Demisexual', 'Graysexual', 'Aromantic', 'Questioning',
];

export const MODES: { id: Mode; label: string; emoji: string; blurb: string }[] = [
  { id: 'date', label: 'Date', emoji: '💘', blurb: 'Romance, on your terms' },
  { id: 'friends', label: 'Friends', emoji: '🫶', blurb: 'Find your people' },
  { id: 'study', label: 'Study', emoji: '📚', blurb: 'Library buddies & project partners' },
];

export const YEARS = ['1st year', '2nd year', '3rd year', '4th year', '5th+ year', 'Grad student', 'PhD'];

export const UNIVERSITIES = [
  'Northbridge University', 'Lakeshore College', 'St. Aurelius University', 'Pacific Tech', 'Riverside State',
];

export const FILTER_OPTIONS: Record<FilterKey, { title: string; hint: string; options: Opt[] }> = {
  intentions: {
    title: 'Looking for',
    hint: 'What kind of connection',
    options: [
      { id: 'long-term', label: 'Long-term', emoji: '💞' },
      { id: 'marriage', label: 'Marriage-minded', emoji: '💍' },
      { id: 'short-term', label: 'Something casual', emoji: '🍹' },
      { id: 'figuring-out', label: 'Figuring it out', emoji: '🤔' },
      { id: 'friends', label: 'New friends', emoji: '🫶' },
    ],
  },
  relationshipStyle: {
    title: 'Relationship style',
    hint: 'How you do relationships',
    options: [
      { id: 'monogamous', label: 'Monogamous' },
      { id: 'enm', label: 'Ethically non-monogamous' },
      { id: 'open-either', label: 'Open to either' },
    ],
  },
  religion: {
    title: 'Faith',
    hint: 'Religion or worldview',
    options: [
      { id: 'agnostic', label: 'Agnostic' },
      { id: 'atheist', label: 'Atheist' },
      { id: 'bahai', label: 'Baháʼí' },
      { id: 'buddhist', label: 'Buddhist' },
      { id: 'catholic', label: 'Catholic' },
      { id: 'christian', label: 'Christian' },
      { id: 'orthodox', label: 'Orthodox Christian' },
      { id: 'lds', label: 'Latter-day Saint' },
      { id: 'hindu', label: 'Hindu' },
      { id: 'jain', label: 'Jain' },
      { id: 'jewish', label: 'Jewish' },
      { id: 'muslim', label: 'Muslim' },
      { id: 'sikh', label: 'Sikh' },
      { id: 'spiritual', label: 'Spiritual' },
      { id: 'zoroastrian', label: 'Zoroastrian' },
      { id: 'other', label: 'Other' },
      { id: 'private', label: 'Prefer not to say' },
    ],
  },
  faithPractice: {
    title: 'Practice',
    hint: 'How central faith is day to day',
    options: [
      { id: 'very', label: 'Very practicing' },
      { id: 'somewhat', label: 'Somewhat practicing' },
      { id: 'cultural', label: 'Cultural' },
      { id: 'not', label: 'Not practicing' },
    ],
  },
  pace: {
    title: 'Values & pace',
    hint: 'How you like to date',
    options: [
      { id: 'slow', label: 'Taking it slow', emoji: '🐢' },
      { id: 'group-dates', label: 'Group dates first', emoji: '👯' },
      { id: 'family', label: 'Family involvement', emoji: '👪' },
      { id: 'chaste', label: 'Waiting until marriage', emoji: '🕊️' },
      { id: 'public-only', label: 'Public places only', emoji: '☕' },
    ],
  },
  drinking: {
    title: 'Drinking',
    hint: '',
    options: [
      { id: 'never', label: 'Never' },
      { id: 'rarely', label: 'Rarely' },
      { id: 'socially', label: 'Socially' },
      { id: 'often', label: 'Often' },
    ],
  },
  smoking: {
    title: 'Smoking / vaping',
    hint: '',
    options: [
      { id: 'no', label: 'No' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'yes', label: 'Yes' },
    ],
  },
  diet: {
    title: 'Diet',
    hint: '',
    options: [
      { id: 'anything', label: 'Eats anything' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'halal', label: 'Halal' },
      { id: 'kosher', label: 'Kosher' },
      { id: 'jain', label: 'Jain diet' },
      { id: 'pescatarian', label: 'Pescatarian' },
    ],
  },
  kids: {
    title: 'Kids someday',
    hint: '',
    options: [
      { id: 'want', label: 'Want kids' },
      { id: 'open', label: 'Open to it' },
      { id: 'unsure', label: 'Not sure' },
      { id: 'dont-want', label: "Don't want kids" },
    ],
  },
};

export const COMMUNITIES: Opt[] = [
  { id: 'lgbtq', label: 'LGBTQ+', emoji: '🏳️‍🌈' },
  { id: 'trans', label: 'Trans & proud', emoji: '🏳️‍⚧️' },
  { id: 'neurodivergent', label: 'Neurodivergent', emoji: '🧠' },
  { id: 'disabled', label: 'Disabled', emoji: '♿' },
  { id: 'deaf', label: 'Deaf / HoH · ASL', emoji: '🤟' },
  { id: 'first-gen', label: 'First-gen student', emoji: '🎓' },
  { id: 'international', label: 'International student', emoji: '🌍' },
  { id: 'student-parent', label: 'Student parent', emoji: '🍼' },
  { id: 'sober', label: 'Sober / straight edge', emoji: '🧃' },
  { id: 'transfer', label: 'Transfer student', emoji: '🔁' },
];

export const INTERESTS = [
  'Hiking', 'Coffee', 'Film', 'Anime', 'Gaming', 'Climbing', 'Cooking', 'Baking', 'Poetry', 'Jazz', 'K-pop',
  'Indie music', 'Thrifting', 'Board games', 'Running', 'Yoga', 'Basketball', 'Soccer', 'Cricket', 'Chess',
  'Photography', 'Painting', 'Theatre', 'Debate', 'Startups', 'Volunteering', 'Astronomy', 'Reading', 'Travel',
  'Dancing', 'Coding', 'Gardening', 'Podcasts', 'Fashion', 'Cycling',
];

export const LANGUAGES = [
  'English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic', 'French', 'Urdu', 'Bengali', 'Portuguese', 'Korean',
  'Japanese', 'Punjabi', 'Tagalog', 'Vietnamese', 'Hebrew', 'Gujarati', 'Swahili', 'German', 'ASL',
];

export const PROMPT_QUESTIONS = [
  'My ideal study break is…',
  'The way to win me over is…',
  "I'm weirdly good at…",
  'A green flag I look for…',
  "Let's debate…",
  'My most controversial campus take…',
  'Typical Sunday…',
  'I geek out on…',
];

export function labelFor(key: FilterKey, id: string): string {
  return FILTER_OPTIONS[key].options.find((o) => o.id === id)?.label ?? id;
}

export function emojiFor(key: FilterKey, id: string): string | undefined {
  return FILTER_OPTIONS[key].options.find((o) => o.id === id)?.emoji;
}
