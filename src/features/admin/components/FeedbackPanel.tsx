import { Lightbulb, Save, Trash2 } from "lucide-react";
import { FEEDBACK_PRIORITIES, FEEDBACK_STATUSES } from "../constants";
import { formatDate } from "../utils/adminHelpers";

function pillClassName(value) {
  if (value === "CRITICAL" || value === "HIGH") {
    return "bg-rose-50 text-rose-700";
  }

  if (value === "PLANNED" || value === "IN_PROGRESS" || value === "SHIPPED") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (value === "UNDER_REVIEW" || value === "MEDIUM") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

export function FeedbackPanel({
  feedbackItems,
  feedbackSummary,
  loading,
  onUpdate,
  onDelete,
}) {
  const summary = feedbackSummary || {
    total: feedbackItems.total || feedbackItems.items.length,
    byStatus: {},
    byPriority: {},
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Feature Feedback</h2>
              <p className="mt-1 text-sm text-slate-300">
                User requests your team can review, prioritize, and ship.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Total", summary.total || 0],
              ["New", summary.byStatus?.NEW || 0],
              ["Planned", summary.byStatus?.PLANNED || 0],
              ["Shipped", summary.byStatus?.SHIPPED || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">Requested Features</h2>
          <p className="mt-1 text-sm text-slate-500">
            Move each request from raw idea to team-ready work.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {!feedbackItems.items.length ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No feedback has been submitted yet.
            </div>
          ) : (
            feedbackItems.items.map((item) => (
              <form
                key={item.id}
                className="grid gap-5 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  onUpdate(item.id, {
                    status: formData.get("status"),
                    priority: formData.get("priority"),
                    category: formData.get("category"),
                    adminNotes: formData.get("adminNotes"),
                  });
                }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950">
                      {item.title}
                    </h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pillClassName(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pillClassName(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.message}
                  </p>
                  {item.useCase ? (
                    <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                      {item.useCase}
                    </p>
                  ) : null}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.name}
                    {item.email ? ` / ${item.email}` : ""} / {formatDate(item.createdAt)}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Status
                      </span>
                      <select
                        name="status"
                        defaultValue={item.status}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                      >
                        {FEEDBACK_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Priority
                      </span>
                      <select
                        name="priority"
                        defaultValue={item.priority}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                      >
                        {FEEDBACK_PRIORITIES.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Category
                    </span>
                    <input
                      name="category"
                      defaultValue={item.category || ""}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Team notes
                    </span>
                    <textarea
                      name="adminNotes"
                      defaultValue={item.adminNotes || ""}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    />
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-red-700 transition hover:bg-red-50"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
