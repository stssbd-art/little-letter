import type { Occasion } from "@/types";
import { OCCASIONS } from "@/lib/constants";

export type OccasionSeo = {
  slug: Occasion;
  emoji: string;
  label: string;
  /** Page title (before site suffix) */
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  tagline: string;
  intro: string;
  body: string[];
  exampleWishes: string[];
  faq: { q: string; a: string }[];
};

const occasionValues = new Set(OCCASIONS.map((o) => o.value));

export function isOccasionSlug(slug: string): slug is Occasion {
  return occasionValues.has(slug as Occasion);
}

export const OCCASION_SEO: Record<Occasion, OccasionSeo> = {
  birthday: {
    slug: "birthday",
    emoji: "🎂",
    label: "Birthday",
    title: "Send a Birthday Card & Wish Online",
    metaDescription:
      "Send a free digital birthday card and warm birthday wish by email. Write your own message or let AI help — first two letters free, then £0.99.",
    keywords: [
      "birthday card",
      "birthday wish",
      "digital birthday card",
      "birthday e-card",
      "send birthday message online",
      "birthday greeting email",
      "online birthday card free",
    ],
    h1: "Send a birthday card & wish by email",
    tagline: "A cosy digital birthday note that lands in their inbox — not a printed card.",
    intro:
      "Skip the shop-bought card. Little Letter helps you send a personal birthday wish by email: cute retro styling, your words (or AI help), and delivery straight to someone you love.",
    body: [
      "Whether it is for a best friend, partner, parent, or colleague, you pick the tone — cute, funny, romantic, or encouraging — and we help you write something that feels like you.",
      "Recipients open a warm email that reads like a sealed note, not a marketing blast. Your first two birthday letters are free; extras are £0.99 each.",
    ],
    exampleWishes: [
      "Happy birthday! Hope your day is full of cake, laughter, and one surprise that makes you grin.",
      "Another year of you being wonderful — grateful I get to celebrate you today.",
    ],
    faq: [
      {
        q: "Is this a physical birthday card?",
        a: "No — Little Letter sends a digital birthday wish by email. It feels like opening a personal note, without postage or printing.",
      },
      {
        q: "Can I write my own birthday message?",
        a: "Yes. Choose “I’ll write it myself” on the create page, or use AI to draft from your details.",
      },
    ],
  },
  love: {
    slug: "love",
    emoji: "❤️",
    label: "Love",
    title: "Send a Love Letter & Romantic Wish Online",
    metaDescription:
      "Send a romantic love letter or sweet love wish by email. Digital love notes with a retro feel — first two letters free.",
    keywords: [
      "love letter online",
      "romantic wish",
      "send love message",
      "digital love card",
      "love note email",
      "romantic e-card",
    ],
    h1: "Send a love letter & romantic wish online",
    tagline: "Soft words for someone who makes your heart flutter.",
    intro:
      "Tell them how you feel with a personal love letter delivered by email — gentle, romantic, and written in your voice (or with a little AI help).",
    body: [
      "Choose a romantic, poetic, or cute style and add the details that matter: how you met, an inside joke, or simply that you miss them.",
      "Perfect for anniversaries, long-distance moments, or just because.",
    ],
    exampleWishes: [
      "I still get a little flutter when I think of you — just wanted you to know.",
      "You are my favourite notification. Love you more than words on a screen can say.",
    ],
    faq: [
      {
        q: "Can I send a love letter to any email?",
        a: "Yes — enter their email address and your message is delivered directly to their inbox.",
      },
    ],
  },
  friendship: {
    slug: "friendship",
    emoji: "🤝",
    label: "Friendship",
    title: "Send a Friendship Card & Thank-You Wish",
    metaDescription:
      "Send a friendship message or digital card to a friend by email. Warm, personal notes — first two letters free.",
    keywords: [
      "friendship card",
      "message for friend",
      "friend birthday wish",
      "digital friendship card",
      "send note to friend",
    ],
    h1: "Send a friendship card & warm wish",
    tagline: "For the friend who always picks up on the first ring.",
    intro:
      "Celebrate friendship with a personal email letter — funny, encouraging, or quietly sweet.",
    body: [
      "Great for best friends, old mates, or someone you have been meaning to check in on.",
      "Write it yourself or describe your friend and let AI draft a note you can edit.",
    ],
    exampleWishes: [
      "Thanks for being the friend who always knows when I need tea and honesty.",
      "Life is better with you in my corner — just saying.",
    ],
    faq: [],
  },
  "good-luck": {
    slug: "good-luck",
    emoji: "🍀",
    label: "Good Luck",
    title: "Send a Good Luck Card & Wish Online",
    metaDescription:
      "Send a good luck message or digital card by email before an exam, interview, or big day. First two letters free.",
    keywords: [
      "good luck card",
      "good luck wish",
      "good luck message",
      "exam good luck",
      "interview good luck email",
    ],
    h1: "Send a good luck card & wish",
    tagline: "A little boost before their big moment.",
    intro:
      "Wish them luck with a personal note — for exams, interviews, moves, or anything nerve-wracking.",
    body: [
      "Encouraging tone, your details, delivered straight to their inbox when they need it most.",
    ],
    exampleWishes: [
      "You've got this — go show them what you are made of.",
      "Sending all the luck and quiet confidence your way today.",
    ],
    faq: [],
  },
  "thinking-of-you": {
    slug: "thinking-of-you",
    emoji: "🌈",
    label: "Thinking of You",
    title: "Send a Thinking of You Card & Message",
    metaDescription:
      "Send a thinking-of-you message or digital card by email. A gentle note for someone on your mind — first two letters free.",
    keywords: [
      "thinking of you card",
      "thinking of you message",
      "miss you email",
      "just because card",
      "send warm message",
    ],
    h1: "Send a thinking-of-you card & message",
    tagline: "Because sometimes “I was thinking of you” is enough.",
    intro:
      "No occasion required — just a soft note to say someone crossed your mind.",
    body: [
      "Perfect when you want to reach out without a big reason. Cosy, personal, and instant.",
    ],
    exampleWishes: [
      "No reason — just wanted you to know you popped into my head and it made me smile.",
      "Sending a little warmth your way today.",
    ],
    faq: [],
  },
  "thank-you": {
    slug: "thank-you",
    emoji: "🌻",
    label: "Thank You",
    title: "Send a Thank You Card & Message Online",
    metaDescription:
      "Send a thank you card and grateful message by email. Personal thank-you notes — first two letters free.",
    keywords: [
      "thank you card",
      "thank you message",
      "thank you email",
      "digital thank you card",
      "gratitude note online",
    ],
    h1: "Send a thank you card & message",
    tagline: "Gratitude deserves more than a quick text.",
    intro:
      "Say thank you properly with a personal email letter — for gifts, help, hospitality, or kindness.",
    body: [
      "Choose a warm style, mention what you are grateful for, and send a note they can keep.",
    ],
    exampleWishes: [
      "Thank you for showing up when it mattered — I won't forget it.",
      "Your kindness made a real difference. Thank you from the bottom of my heart.",
    ],
    faq: [],
  },
  congratulations: {
    slug: "congratulations",
    emoji: "🎉",
    label: "Congratulations",
    title: "Send a Congratulations Card & Wish",
    metaDescription:
      "Send a congratulations message or digital card by email for achievements big and small. First two letters free.",
    keywords: [
      "congratulations card",
      "congratulations message",
      "congrats wish online",
      "celebration email card",
    ],
    h1: "Send a congratulations card & wish",
    tagline: "Celebrate their win with words that feel personal.",
    intro:
      "From promotions to personal milestones — send a congratulations note that stands out from a group chat emoji.",
    body: [
      "Add what they achieved and why you are proud. Cute, funny, or sincere — your choice.",
    ],
    exampleWishes: [
      "So proud of you — you earned every bit of this.",
      "Congratulations! Nobody works harder or deserves this more.",
    ],
    faq: [],
  },
  sorry: {
    slug: "sorry",
    emoji: "💙",
    label: "Sorry",
    title: "Send a Sorry Card & Apology Message",
    metaDescription:
      "Send a sincere apology or sorry message by email. Thoughtful digital notes when words matter — first two letters free.",
    keywords: [
      "sorry card",
      "apology message",
      "sorry email",
      "apology letter online",
      "i am sorry message",
    ],
    h1: "Send a sorry message & apology note",
    tagline: "When you mean it and want them to feel it.",
    intro:
      "A thoughtful email letter can say sorry with care — not as a cold text, but as a note they can read in their own time.",
    body: [
      "Write your own apology or describe the situation and let AI help you find gentle, honest words.",
    ],
    exampleWishes: [
      "I am truly sorry. I was wrong, and I want to make things right.",
      "You deserved better from me. I am sorry, and I am listening.",
    ],
    faq: [],
  },
  wedding: {
    slug: "wedding",
    emoji: "💒",
    label: "Wedding",
    title: "Send a Wedding Card & Congratulations Wish",
    metaDescription:
      "Send a wedding congratulations card and warm wish by email. Digital wedding messages — first two letters free.",
    keywords: [
      "wedding card",
      "wedding congratulations",
      "wedding wish online",
      "digital wedding card",
      "wedding message email",
    ],
    h1: "Send a wedding card & congratulations wish",
    tagline: "Celebrate their day with a note they can keep.",
    intro:
      "Send wedding congratulations by email — romantic, poetic, or joyful — when you want something warmer than a social post.",
    body: [
      "Perfect for guests who cannot attend in person or want to add a personal message alongside a gift.",
    ],
    exampleWishes: [
      "Wishing you a lifetime of laughter, patience, and tiny everyday joys.",
      "So happy for you both — may your marriage be as warm as this note.",
    ],
    faq: [],
  },
  graduation: {
    slug: "graduation",
    emoji: "🎓",
    label: "Graduation",
    title: "Send a Graduation Card & Congratulations Wish",
    metaDescription:
      "Send a graduation congratulations card and proud message by email. Digital grad wishes — first two letters free.",
    keywords: [
      "graduation card",
      "graduation congratulations",
      "graduation wish",
      "congrats graduate message",
    ],
    h1: "Send a graduation card & proud wish",
    tagline: "They worked hard — tell them you noticed.",
    intro:
      "Celebrate their graduation with a personal email letter full of pride and encouragement for what comes next.",
    body: [
      "From school leavers to postgrads — add their course, your pride, and send instantly.",
    ],
    exampleWishes: [
      "You did it — all those late nights were worth this moment.",
      "So proud of the graduate you have become. The world is lucky to have you.",
    ],
    faq: [],
  },
  promotion: {
    slug: "promotion",
    emoji: "🚀",
    label: "Promotion",
    title: "Send a Promotion Congratulations Card",
    metaDescription:
      "Send a promotion congratulations message or digital card by email. Celebrate their new role — first two letters free.",
    keywords: [
      "promotion congratulations",
      "new job card",
      "work promotion message",
      "congrats on promotion",
    ],
    h1: "Send a promotion congratulations card",
    tagline: "New title, same awesome them.",
    intro:
      "Congratulate them on a promotion or new job with a note that feels personal, not corporate.",
    body: [
      "Encouraging, funny, or proud — describe the win and send a message straight to their inbox.",
    ],
    exampleWishes: [
      "Promotion well deserved — they have no idea how lucky they are.",
      "New role, same brilliance. Could not be happier for you.",
    ],
    faq: [],
  },
  "valentines-day": {
    slug: "valentines-day",
    emoji: "💝",
    label: "Valentine's Day",
    title: "Send a Valentine's Day Card & Love Wish",
    metaDescription:
      "Send a Valentine's Day card and romantic wish by email. Digital Valentine e-cards with heart — first two letters free.",
    keywords: [
      "valentines day card",
      "valentine e-card",
      "valentines wish online",
      "send valentine message",
      "digital valentine card",
    ],
    h1: "Send a Valentine's Day card & love wish",
    tagline: "Romantic notes for February — or any day you feel lovey.",
    intro:
      "Send a Valentine's Day message by email: romantic, cute, or funny, with a retro letter feel.",
    body: [
      "Write your own valentine or let AI help from your relationship details. Delivered straight to their inbox.",
    ],
    exampleWishes: [
      "Happy Valentine's Day — you are still my favourite person to be silly with.",
      "Roses are overrated. You are not.",
    ],
    faq: [],
  },
  "mothers-day": {
    slug: "mothers-day",
    emoji: "🌷",
    label: "Mother's Day",
    title: "Send a Mother's Day Card & Wish Online",
    metaDescription:
      "Send a Mother's Day card and grateful message by email. Digital Mother's Day wishes — first two letters free.",
    keywords: [
      "mothers day card",
      "mothers day message",
      "mothers day e-card",
      "send mothers day wish",
      "digital mothers day card",
    ],
    h1: "Send a Mother's Day card & wish",
    tagline: "Tell Mum (or a mother figure) what she means to you.",
    intro:
      "Send a Mother's Day message by email — warm, grateful, and personal, even if you cannot visit in person.",
    body: [
      "Add memories, gratitude, and your own words. A digital card that feels handwritten.",
    ],
    exampleWishes: [
      "Happy Mother's Day — thank you for every quiet sacrifice I only noticed later.",
      "To the best mum: you made home feel safe and full of love.",
    ],
    faq: [],
  },
  "fathers-day": {
    slug: "fathers-day",
    emoji: "👔",
    label: "Father's Day",
    title: "Send a Father's Day Card & Wish Online",
    metaDescription:
      "Send a Father's Day card and message by email. Digital Father's Day wishes — first two letters free.",
    keywords: [
      "fathers day card",
      "fathers day message",
      "fathers day e-card",
      "send fathers day wish",
      "digital fathers day card",
    ],
    h1: "Send a Father's Day card & wish",
    tagline: "For Dad, stepdad, or any father figure who showed up.",
    intro:
      "Send a Father's Day note by email — funny, grateful, or quietly sincere.",
    body: [
      "Perfect when distance or timing makes a posted card hard. Instant delivery, personal words.",
    ],
    exampleWishes: [
      "Happy Father's Day — thanks for the bad jokes and the good advice.",
      "Grateful for every lesson you taught without making a speech about it.",
    ],
    faq: [],
  },
};

export const OCCASION_SEO_LIST = OCCASIONS.map((o) => OCCASION_SEO[o.value]);

export function getOccasionSeo(slug: string): OccasionSeo | null {
  if (!isOccasionSlug(slug)) return null;
  return OCCASION_SEO[slug];
}
