import {
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  Tag,
} from "lucide-react";

const iconByStat = {
  total: FileText,
  published: CheckCircle2,
  drafts: Clock3,
  categories: FolderOpen,
  tags: Tag,
};

const toneByStat = {
  cyan: "bg-cyan-50 text-cyan-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700",
  violet: "bg-violet-50 text-violet-700",
};

export function StatsGrid({ stats }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = iconByStat[stat.id];
        const tone = toneByStat[stat.tone];

        return (
          <article
            key={stat.id}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
