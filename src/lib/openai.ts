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

/** Warm fallback when OpenAI is unavailable — still personal, never Hallmark-generic. */
export function buildFallbackMessage(form: LetterFormData): { subject: string; message: string } {
  const occasion = occasionLabel(form.occasion);
  const note = form.customNote.trim();

  const openings: Record<LetterFormData["style"], string> = {
    cute: `Hi ${form.recipientName}, you tiny constellation of goodness —`,
    funny: `${form.recipientName}! Consider this a legally binding hug delivered via email.`,
    romantic: `Dear ${form.recipientName}, if days had pockets, I would tuck this note into yours.`,
    whimsical: `Greetings, ${form.recipientName}, from a slightly enchanted corner of the internet —`,
    poetic: `${form.recipientName}, the afternoon paused long enough for this letter to find you.`,
    encouraging: `${form.recipientName}, soft reminder from someone who believes in you:`,
  };

  const middles: Record<LetterFormData["occasion"], string> = {
    birthday: `Today the calendar gets to celebrate you, and I get to join in with this little letter. May your year ahead be full of easy laughter, unexpected kindness, and snacks that taste like victory.`,
    love: `I keep finding reasons to smile that all somehow lead back to you. This is just a small way of saying your presence makes ordinary hours feel brighter.`,
    friendship: `Our friendship is one of my favourite quiet miracles — the kind that shows up in memes, check-ins, and the knowledge that someone out there gets it.`,
    "good-luck": `Whatever you are walking into, take this with you: you are more prepared than the nervous butterflies suggest. Go gently, go bravely, go as yourself.`,
    "thinking-of-you": `You floated into my thoughts today like a familiar song, and I wanted you to know — you are thought of, warmly and specifically.`,
    "thank-you": `Thank you for the way you show up. It does not go unnoticed, even when life is busy and words arrive a little late.`,
    congratulations: `Look at you — doing the thing! This win deserves confetti, a soft victory dance, and at least one slightly ridiculous celebration.`,
    sorry: `I am sorry. Not in a tidy, performative way — in a real way. I care about you, and I want us to feel lighter again.`,
  };

  const styleExtra: Record<LetterFormData["style"], string> = {
    cute: `Sending you a pocketful of pixel hearts and one very sincere smile.`,
    funny: `P.S. If this email makes you snort-laugh in public, that is considered a feature.`,
    romantic: `You are my favourite plot twist and my softest place to land.`,
    whimsical: `May a friendly cloud follow you around today, whispering compliments.`,
    poetic: `May your evening arrive like folded linen — calm, warm, and quietly beautiful.`,
    encouraging: `You do not have to be finished to be worthy of rest, pride, and kindness.`,
  };

  const custom = note
    ? `\n\nAlso, a little note from ${form.senderName}: ${note}`
    : "";

  const message = `${openings[form.style]}

${middles[form.occasion]}

${styleExtra[form.style]}${custom}

With warmth,
${form.senderName}
💌`;

  return {
    subject: `💌 A little ${occasion.toLowerCase()} letter for ${form.recipientName}`,
    message,
  };
}

export async function generateLetterMessage(form: LetterFormData) {
  const client = getClient();

  if (!client) {
    return buildFallbackMessage(form);
  }

  const occasion = occasionLabel(form.occasion);
  const style = styleLabel(form.style);

  const prompt = `Write a short personal message for an email letter.

Recipient: ${form.recipientName}
Sender: ${form.senderName}
Relationship: ${form.relationship}
Occasion: ${occasion}
Style: ${style}
Custom notes from sender: ${form.customNote || "(none)"}

Rules:
- Warm, magical, personal — never generic Hallmark clichés
- Avoid phrases like "thinking of you during this special time", "wishing you all the best", "may all your dreams come true"
- 120–180 words
- Sound like a thoughtful human with a soft sense of wonder
- Include a gentle sign-off from ${form.senderName}
- No hashtags, no emojis in the body except optionally one at the end
- Return JSON with keys: subject, message`;

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.95,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write unique, heartfelt micro-letters for Little Letter, a nostalgic whimsical messaging site. Never produce generic greeting-card copy.",
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
