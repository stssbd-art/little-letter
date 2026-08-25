/**
 * Ensure "Dear Name, …" starts the body on the next line (classic letter layout).
 * Safe if a blank line is already there.
 */
export function breakAfterLetterGreeting(message: string): string {
  return message.replace(/^(Dear\s+[^,\n]+),\s*(?=\S)/i, "$1\n\n");
}
