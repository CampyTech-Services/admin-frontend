import {
  CheckCircle2,
  CircleDashed,
  LockKeyhole,
  RefreshCw,
  Rocket,
} from "lucide-react";

const statusTone = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  mvp: "border-cyan-200 bg-cyan-50 text-cyan-700",
  planned: "border-slate-200 bg-slate-50 text-slate-600",
};

export function StudentPlatformPanel({
  settings,
  loading,
  isSuperAdmin,
  onToggle,
  onRefresh,
}) {
  const isEnabled = Boolean(settings?.isEnabled);
  const components = settings?.components || [];
  const revenueLevers = settings?.revenueLevers || [];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
              <Rocket className="h-4 w-4" />
              <span>Student OS Launch</span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              {settings?.title || "Student Profile Economy"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Public access is controlled here. When this switch is off, the
              Student Platform UI, matching tools, admission score, marketplace,
              and related payment products remain closed to users.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Public status
                </p>
                <p className="mt-2 text-2xl font-black">
                  {isEnabled ? "Open to users" : "Closed"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                disabled={!isSuperAdmin || loading}
                onClick={() => onToggle(!isEnabled)}
                className={`relative h-10 w-20 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isEnabled
                    ? "border-emerald-300 bg-emerald-400"
                    : "border-white/15 bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition ${
                    isEnabled ? "left-11" : "left-1"
                  }`}
                />
              </button>
            </div>

            {!isSuperAdmin ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100">
                <LockKeyhole className="h-4 w-4" />
                <span>Only super admins can change launch status.</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh status"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            Feature readiness
          </h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {components.map((component) => {
              const Icon = component.status === "planned" ? CircleDashed : CheckCircle2;
              return (
                <article
                  key={component.id}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-950">
                        {component.label}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {component.description}
                      </p>
                    </div>
                    <Icon className="h-5 w-5 shrink-0 text-cyan-700" />
                  </div>
                  <span
                    className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${
                      statusTone[component.status] || statusTone.planned
                    }`}
                  >
                    {component.status}
                  </span>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">Revenue levers</h3>
          <div className="mt-5 space-y-3">
            {revenueLevers.map((lever) => (
              <div
                key={lever}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-700" />
                <span>{lever}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
