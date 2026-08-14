import { randomInt } from "crypto";
import OpenAI from "openai";
import type { LetterFormData } from "@/types";
import { OCCASIONS, STYLES } from "@/lib/constants";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function occasionLabel(value: LetterFormData["occasion"]) {
  return OCCASIONS.find((o) => o.value === value)?.label ?? value;
}

function styleLabel(value: LetterFormData["style"]) {
  return STYLES.find((s) => s.value === value)?.label ?? value;
}

function pick<T>(items: T[]): T {
  return items[randomInt(items.length)]!;
}

function pickAvoiding<T>(items: T[], used: Set<string>, keyFn: (item: T) => string): T {
  const unused = items.filter((item) => !used.has(keyFn(item)));
  const pool = unused.length > 0 ? unused : items;
  const chosen = pick(pool);
  used.add(keyFn(chosen));
  // Keep memory small
  if (used.size > 40) {
    const first = used.values().next().value;
    if (first) used.delete(first);
  }
  return chosen;
}

/** Avoid immediate repeats inside the same server instance. */
const recentOpenings = new Set<string>();
const recentMiddles = new Set<string>();
const recentExtras = new Set<string>();
const recentSubjects = new Set<string>();
const recentDetails = new Set<string>();

const OPENINGS: Record<LetterFormData["style"], string[]> = {
  cute: [
    `Hi {name}, quick soft hello from me —`,
    `Hey {name}, I made this note small on purpose.`,
    `{name}! Catching you with a little kindness before the day runs off.`,
    `Dear {name}, I packed one sincere smile into this email.`,
    `{name}, consider this a sticker on your digital fridge.`,
    `Hello {name} — warm ping incoming.`,
  ],
  funny: [
    `{name}! This is an official hug with email paperwork.`,
    `Attention {name}: someone on the internet likes you. Shocking, I know.`,
    `{name}, I almost sent a meme. Then I got responsible. Sort of.`,
    `Newsflash for {name}: excellence detected in your general direction.`,
    `{name}, please sign for this delivery of mild nonsense and real care.`,
    `Hey {name} — low battery on worries, fully charged on rooting for you.`,
  ],
  romantic: [
    `Dear {name}, I kept thinking of you, so I wrote it down.`,
    `{name}, ordinary minutes feel better when you are in them.`,
    `Hi {name} — this note is me choosing honesty over silence.`,
    `For {name}, because liking you is my favourite habit.`,
    `{name}, if care had a handwriting, this would be it.`,
    `Dear {name}, a soft letter for a person who softens my days.`,
  ],
  whimsical: [
    `{name}, a wandering idea asked me to send this to you.`,
    `Dear {name}, the pixels insisted your name belonged here.`,
    `Hello {name} — please accept this tiny lantern of a message.`,
    `{name}, a friendly draft owl dropped this on my keyboard.`,
    `Greetings {name}, from the cosy side of the outbox.`,
    `{name}, this letter took the scenic route through my thoughts.`,
  ],
  poetic: [
    `{name}, between one errand and the next, I thought of you.`,
    `Dear {name}, a quiet paragraph with your name folded inside.`,
    `{name}, these lines arrived softer than the rest of the day.`,
    `For {name} — a pause, then a message.`,
    `{name}, the evening felt unfinished until I wrote to you.`,
    `Dear {name}, here is a calm page in a loud week.`,
  ],
  encouraging: [
    `{name}, soft reminder from your personal cheer section:`,
    `Hey {name} — bravery can look like reading a kind note.`,
    `{name}, this is your one-person hype committee reporting in.`,
    `Dear {name}, you do not have to earn this kindness.`,
    `{name}, progress counts even when it is quiet.`,
    `Hi {name} — leaving a little courage by the door for you.`,
  ],
};

const MIDDLES: Record<LetterFormData["occasion"], string[]> = {
  birthday: [
    `Happy birthday in the real way: may today give you ease, one good laugh, and a moment that feels like yours alone.`,
    `Another year of being you — which is, frankly, excellent news. I hope the day feels gentle and a little sparkly.`,
    `On your birthday I am less interested in perfect plans and more interested in you feeling celebrated properly.`,
    `May your year ahead include better snacks, kinder surprises, and people who get your jokes.`,
    `Today the calendar is right about one thing: you deserve a fuss. Consider this my contribution.`,
    `I hope your birthday soundtrack includes your favourite song and at least one unnecessarily joyful dance.`,
  ],
  love: [
    `I keep noticing how you make ordinary hours feel brighter. That is not small. That is love in everyday clothes.`,
    `Caring about you shows up in tiny ways — remembering your stories, wanting your day to go well, writing this.`,
    `You are my favourite kind of certainty: not dramatic, just true.`,
    `If affection were a habit, you would be the one I never want to break.`,
    `I like you in the quiet moments and the loud ones. This letter is proof I mean it.`,
    `Distance, deadlines, noise — none of them cancel out how glad I am that you exist in my life.`,
  ],
  friendship: [
    `Our friendship is the good kind of easy: memes, honesty, and the comfort of being understood without a speech.`,
    `Thank you for being someone I can send half-finished thoughts to. That ease is rare.`,
    `You make friendship feel like a shared joke that still works years later.`,
    `Some friends are fireworks. You are a porch light — steady when the day goes dim.`,
    `I am glad we found each other in this loud world. It makes the whole thing less lonely.`,
    `You are one of my favourite humans to know. Not in a brochure way — in a real, tea-and-texts way.`,
  ],
  "good-luck": [
    `Whatever you are walking into, take this with you: you are more ready than the nerves admit.`,
    `Good luck of the useful kind — the kind that sits in your pocket and says go as yourself.`,
    `May the awkward bits be short and the brave bits be real. I am rooting for you from here.`,
    `I am sending luck like a spare battery: quiet, practical, and available when you need it.`,
    `You have handled hard things before. This next step gets the benefit of that history.`,
    `Walk in with your shoulders a little softer. You do not have to impress the whole room — just show up.`,
  ],
  "thinking-of-you": [
    `No big reason, no dramatic occasion — just you crossing my mind, and me deciding that deserved a letter.`,
    `You floated into my thoughts today, and I wanted you to know it was warm and specific.`,
    `Somewhere between chores and scrolling I paused and thought: {name} should feel cared for today.`,
    `This is a small signal across the internet that says you matter here, right now, to me.`,
    `I hope your day has at least one kind corner. I am thinking of you from mine.`,
    `Not checking in out of duty — just because your name showed up in my head and stayed.`,
  ],
  "thank-you": [
    `Thank you for the way you show up. It does not go unnoticed, even when my thank-yous arrive late.`,
    `Gratitude looked like you today, so I wrote it down properly.`,
    `You did something kind, maybe quietly, and I do not want it to disappear into the rush.`,
    `This thank-you is not polite wallpaper. Your help and presence made a difference.`,
    `I am better for knowing you, and today that felt important enough to say out loud.`,
    `Thank you for the patience, the help, the being-there. I notice it more than I say.`,
  ],
  congratulations: [
    `Look at you — doing the thing. This win deserves a silly celebration and a real pause.`,
    `Congratulations of the honest kind: effort met an open door. I am proud of you.`,
    `Your win made my day brighter too. Please enjoy it before the world asks what is next.`,
    `Well done. Not glossy-magazine well done — the earned kind.`,
    `I hope you let yourself feel this for a full minute. You worked for it.`,
    `Confetti, metaphorically. Also literally, if you have any. You earned the mess.`,
  ],
  sorry: [
    `I am sorry in the real way, not the tidy way. I care about you and want us lighter again.`,
    `This is me owning my part without decorating it. I am sorry.`,
    `I messed up, and you deserved better. I am grateful you are reading this.`,
    `Sorry is a small word for a true feeling. I mean it. I value you more than my pride.`,
    `I hate that I added weight to your day. I am sorry, and I want to do better.`,
    `If I could rewind, I would choose kinder. Since I cannot, I am choosing honesty now.`,
  ],
};

const EXTRAS: Record<LetterFormData["style"], string[]> = {
  cute: [
    `Sending one sincere smile and a pocket of tiny cheer.`,
    `Please treat this like a digital sticky note on a sunny window.`,
    `If kindness had a ringtone, this email would be trying its best.`,
    `Virtual sticker enclosed: star, envelope, tiny yes.`,
  ],
  funny: [
    `P.S. Snort-laughing in public counts as successful delivery.`,
    `P.S. No refunds on warmth. Store credit in smiles only.`,
    `P.S. I almost added a drumroll. Professionalism stopped me. Barely.`,
    `P.S. This message contains 0% kale and 100% care.`,
  ],
  romantic: [
    `You remain my favourite plot twist.`,
    `Distance can wait. This note refuses to.`,
    `I like you in everyday ways and extraordinary ones.`,
    `If this lands softly, that was intentional.`,
  ],
  whimsical: [
    `May a friendly cloud loiter near you with compliments.`,
    `If something sparkly catches your eye later, wave — that was me.`,
    `Please file under Magical Correspondence, Priority Soft.`,
    `A butterfly has been briefed on your excellence.`,
  ],
  poetic: [
    `May your evening arrive like folded linen.`,
    `Keep this like a pressed leaf between ordinary days.`,
    `I hope these lines land softly, like rain that knows your name.`,
    `A quiet wish for a quieter hour, just for you.`,
  ],
  encouraging: [
    `You do not have to be finished to be worthy of rest.`,
    `Quiet progress still counts.`,
    `Be as gentle with yourself as you are with people you love.`,
    `Courage can be small and still be real.`,
  ],
};

const DETAILS = [
  `Right now the light on my screen looks a little gold, which felt like a sign to write.`,
  `I nearly left this as a half-thought. Then I decided you deserved the finished version.`,
  `There is tea going cold beside me and a sentence that would not leave me alone until I sent it.`,
  `I wrote this between two ordinary tasks, which somehow made it feel more true.`,
  `The day was noisy, so I made this note quiet on purpose.`,
  `I almost waited for a "better moment." Then I remembered better moments are made.`,
  `A song shuffled on and reminded me of you, so here we are.`,
  `I checked the clock, shrugged, and chose kindness over perfect timing.`,
  `This started as a one-line draft and grew feelings. Sorry not sorry.`,
  `If my grammar wobbles, blame affection. It is distracting in the best way.`,
];

const SUBJECTS = [
  `For {name} — a small warm note`,
  `{name}, opening this counts as a tiny gift`,
  `Something soft for {name}`,
  `{name}: a letter, not a lecture`,
  `Hi {name} — this one is from the heart`,
  `A {occasion} note for {name}`,
  `{name}, I wrote you a little thing`,
  `Outbox → {name} → smile hopefully`,
  `{name}, please read when you have thirty kind seconds`,
  `From {sender} to {name}, with care`,
];

const SIGN_OFFS = [
  `With warmth,\n{sender}`,
  `Yours, softly,\n{sender}`,
  `Sent with care,\n{sender}`,
  `Always rooting for you,\n{sender}`,
  `Talk soon,\n{sender}`,
  `On your side,\n{sender}`,
  `Until next time,\n{sender}`,
  `Hugs (digital but sincere),\n{sender}`,
];

const ENDINGS = ["💌", "✨", "🌟", "🍀", "🎵", "☁️"];

const ANGLES = [
  "open with a tiny sensory detail (light, weather, a sound)",
  "include one unexpected but gentle metaphor",
  "sound like a handwritten note found in a coat pocket",
  "keep it playful but sincere, like a good friend texting carefully",
  "focus on one specific quality of the recipient",
  "make it feel like a quiet late-evening conversation",
  "use a short recurring image once (star, window, song, tea)",
  "write as if time slowed down for thirty seconds just for this",
];

function fill(template: string, form: LetterFormData) {
  return template
    .replaceAll("{name}", form.recipientName)
    .replaceAll("{sender}", form.senderName)
    .replaceAll("{occasion}", occasionLabel(form.occasion).toLowerCase());
}

/** Warm fallback when OpenAI is unavailable — heavily randomised each call. */
export function buildFallbackMessage(form: LetterFormData): {
  subject: string;
  message: string;
} {
  const note = form.customNote.trim();
  const opening = fill(
    pickAvoiding(OPENINGS[form.style], recentOpenings, (s) => s),
    form
  );
  const middle = fill(
    pickAvoiding(MIDDLES[form.occasion], recentMiddles, (s) => s),
    form
  );
  const extra = pickAvoiding(EXTRAS[form.style], recentExtras, (s) => s);
  const detail = pickAvoiding(DETAILS, recentDetails, (s) => s);
  const signOff = fill(pick(SIGN_OFFS), form);
  const subject = fill(
    pickAvoiding(SUBJECTS, recentSubjects, (s) => s),
    form
  );
  const ending = pick(ENDINGS);

  const custom = note
    ? `\n\nAlso, a little note from ${form.senderName}: ${note}`
    : "";

  // Shuffle structure slightly so letters do not feel template-identical
  const layout = randomInt(3);
  let body: string;
  if (layout === 0) {
    body = `${opening}\n\n${middle}\n\n${detail}\n\n${extra}${custom}\n\n${signOff}\n${ending}`;
  } else if (layout === 1) {
    body = `${opening}\n\n${detail}\n\n${middle}\n\n${extra}${custom}\n\n${signOff}\n${ending}`;
  } else {
    body = `${opening}\n\n${middle}\n\n${extra}\n\n${detail}${custom}\n\n${signOff}\n${ending}`;
  }

  return { subject, message: body };
}

export async function generateLetterMessage(form: LetterFormData) {
  const client = getClient();

  if (!client) {
    return buildFallbackMessage(form);
  }

  const occasion = occasionLabel(form.occasion);
  const style = styleLabel(form.style);
  const angle = pick(ANGLES);
  const spice = randomInt(1000, 9999);

  const prompt = `Write a short personal message for an email letter.

Recipient: ${form.recipientName}
Sender: ${form.senderName}
Relationship: ${form.relationship}
Occasion: ${occasion}
Style: ${style}
Custom notes from sender: ${form.customNote || "(none)"}
Creative angle for THIS draft only: ${angle}
Variation seed: ${spice}

Rules:
- Sound like a real person emailing a friend — casual, specific, short
- 80–140 words
- No marketing language, no “Little Letter”, no slogans, no hashtags
- No emojis
- Include a simple sign-off from ${form.senderName}
- Return JSON with keys: subject, message
- Subject should be a normal personal email subject (not promotional)`;

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 1.2,
      presence_penalty: 0.7,
      frequency_penalty: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write short personal emails that sound like a human friend, not an app or a greeting card.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { subject?: string; message?: string };

    if (!parsed.subject || !parsed.message) {
      return buildFallbackMessage(form);
    }

    return {
      subject: parsed.subject,
      message: parsed.message,
    };
  } catch {
    return buildFallbackMessage(form);
  }
}
