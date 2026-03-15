interface StatItem {
  label: string;
  value: number;
}

export function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <p className="text-[13px] text-neutral-500 font-medium tracking-wide uppercase">
            {stat.label}
          </p>
          <p className="text-3xl font-semibold text-neutral-900 mt-2 tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
