import Link from "next/link";

interface CategoryPillProps {
  name: string;
  slug?: string;
  linked?: boolean;
}

export function CategoryPill({
  name,
  slug,
  linked = false,
}: CategoryPillProps) {
  const classes =
    "inline-block rounded-xl bg-tag-bg text-tag-text text-xs font-medium px-3 py-1";

  if (linked && slug) {
    return (
      <Link href={`/${slug}`} className={`${classes} hover:opacity-80`}>
        {name}
      </Link>
    );
  }

  return <span className={classes}>{name}</span>;
}
