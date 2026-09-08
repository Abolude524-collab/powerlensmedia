export function normalizeCategory(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ") || "";
}