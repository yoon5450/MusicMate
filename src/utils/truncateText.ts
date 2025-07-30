export function truncateText(text: string, limit: number = 100): string {
  if (text.length > limit) return text.slice(0, limit) + "...";
  return text;
}
