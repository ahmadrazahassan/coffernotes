export function ReadTimeBadge({ minutes }: { minutes: number | null }) {
  if (!minutes) return null;
  return (
    <span className="text-xs text-text-secondary">{minutes} min read</span>
  );
}
