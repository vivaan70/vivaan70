# quad 💜

A campus-only app for dating, making friends and finding study buddies. It's a front-end prototype: React + TypeScript + Vite + framer-motion. Data is mocked and saved in `localStorage`.

```bash
cd quad
npm install
npm run dev
```

## What's in it

- **Onboarding**: .edu email verification (any 6-digit code works in the demo), then basics, identity, modes, intentions, faith, lifestyle and prompts. Most steps can be skipped.
- **Three modes**: 💘 Date, 🫶 Friends, 📚 Study. You can switch from the top of Discover.
- **Swipe deck**: drag or use the buttons (pass / crush / like). Tap the left or right side of a card to page through bio, prompt and basics. Each card shows a compatibility % and the reasons for it.
- **Matches**: shows who likes you, new matches, and chats. Chats offer icebreakers built from shared interests, and the other person sends mock replies.
- **Profile**: edit any section, preview how others see you, incognito, snooze, "I message first", and dark/light theme.

## Inclusive by design

- **Gender**: 11 options plus self-describe. You choose which searches you appear in. Nothing is inferred from your gender.
- **Pronouns**: presets plus custom.
- **Sexuality**: pick as many as fit, and choose whether to show it.
- **Who you see**: any combination of women, men and non-binary people. Gender matching is **mutual**.
- **Faith**: 17 options and how practising you are. "Only match within my faith" works **both ways**.
- **Values & pace**: taking it slow, group dates first, family involvement, waiting until marriage, public places only.
- **Lifestyle**: drinking, smoking, diet (halal, kosher, Jain, vegan…) and kids.
- **Relationship style**: monogamous, ENM, or open to either.
- **Communities** (optional): LGBTQ+, trans, neurodivergent, disabled, Deaf/HoH, first-gen, international, student parent, sober.
- **Preferences vs. dealbreakers**: every filter ranks matches higher by default. Turning on "dealbreaker" hides everyone who doesn't match. Other people's dealbreakers apply to you too.

Matching logic is in [`src/matching.ts`](src/matching.ts).
