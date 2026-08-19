/** Google Analytics 4 Measurement ID, e.g. G-XXXXXXXXXX */
export function getGaMeasurementId() {
  const raw =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
    // Vercel was first set as NEXT_PUBLIC_GA_MEASUREMENT (missing _ID)
    process.env.NEXT_PUBLIC_GA_MEASUREMENT?.trim() ||
    "";
  if (!/^G-[A-Z0-9]+$/i.test(raw)) return "";
  return raw.toUpperCase();
}
