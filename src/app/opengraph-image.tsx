import {
  createBrandOpenGraphImage,
  ogAlt,
  ogContentType,
  ogSize,
} from "@/lib/og-brand";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage() {
  return createBrandOpenGraphImage();
}
