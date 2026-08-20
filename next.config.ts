import type { NextConfig } from "next";

const occasionRedirects = [
  ["birthday-card", "birthday"],
  ["birthday-wish", "birthday"],
  ["birthday-cards", "birthday"],
  ["valentine-card", "valentines-day"],
  ["valentines-card", "valentines-day"],
  ["valentines-day-card", "valentines-day"],
  ["mothers-day-card", "mothers-day"],
  ["fathers-day-card", "fathers-day"],
  ["wedding-card", "wedding"],
  ["thank-you-card", "thank-you"],
  ["love-card", "love"],
  ["graduation-card", "graduation"],
  ["e-card", "occasions"],
  ["ecard", "occasions"],
  ["greeting-card", "occasions"],
  ["greeting-cards", "occasions"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/cards", destination: "/create", permanent: true },
      ...occasionRedirects.map(([source, destination]) => ({
        source: `/${source}`,
        destination: `/${destination}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
