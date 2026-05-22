import { BookOpenCheck, Edit2, PlusCircle, Trash2 } from "lucide-react";
import { COURSE_LEVELS, COURSE_STATUSES } from "../constants";
import { formatCurrency, formatDate } from "../utils/adminHelpers";

function statusClassName(status) {
  if (status === "PUBLISHED") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "DRAFT") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

export function CoursesPanel({
  courses,
  courseForm,
  editingCourse,
  loading,
  onFieldChange,
  onSubmit,
  onEdit,
  onDelete,
  onReset,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">
              {editingCourse ? "Edit Course" : "New Tech Course"}
            </h2>
            <p className="mt-1 text-sm leading-7 text-slate-500">
              Publish student-ready tech courses and keep drafts private until
              they are ready to sell.
            </p>
          </div>
          <PlusCircle className="mt-2 h-5 w-5 text-cyan-600" />
        </div>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </span>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Slug
            </span>
            <input
              type="text"
              required
              value={courseForm.slug}
              onChange={(event) => onFieldChange("slug", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Short Description
            </span>
            <textarea
              rows={2}
              required
              value={courseForm.shortDescription}
              onChange={(event) => onFieldChange("shortDescription", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Full Description
            </span>
            <textarea
              rows={4}
              required
              value={courseForm.description}
              onChange={(event) => onFieldChange("description", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={courseForm.price}
                onChange={(event) => onFieldChange("price", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Currency
              </span>
              <input
                type="text"
                value={courseForm.currency}
                onChange={(event) => onFieldChange("currency", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Level
              </span>
              <select
                value={courseForm.level}
                onChange={(event) => onFieldChange("level", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {COURSE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Duration
              </span>
              <input
                type="text"
                required
                value={courseForm.duration}
                onChange={(event) => onFieldChange("duration", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Thumbnail URL
            </span>
            <input
              type="url"
              value={courseForm.thumbnailUrl}
              onChange={(event) => onFieldChange("thumbnailUrl", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Outcomes
            </span>
            <textarea
              rows={5}
              required
              value={courseForm.outcomes}
              onChange={(event) => onFieldChange("outcomes", event.target.value)}
              placeholder="One outcome per line"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </span>
              <select
                value={courseForm.status}
                onChange={(event) => onFieldChange("status", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {COURSE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Publish Date
              </span>
              <input
                type="datetime-local"
                value={courseForm.publishedAt}
                onChange={(event) => onFieldChange("publishedAt", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : editingCourse ? "Update Course" : "Save Course"}
            </button>
            {editingCourse ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <section className="rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">Course Catalog</h2>
          <p className="mt-1 text-sm text-slate-500">
            Published courses appear on the public services page.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {!courses.items.length ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No courses yet.
            </div>
          ) : (
            courses.items.map((course) => (
              <article key={course.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-950">
                        {course.title}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(course.status)}`}>
                        {course.status}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {course.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {course.shortDescription}
                    </p>
                    <p className="mt-3 text-lg font-black text-slate-950">
                      {formatCurrency(course.price)} / {course.duration}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {course.status === "PUBLISHED"
                        ? `Published ${formatDate(course.publishedAt || course.updatedAt)}`
                        : `Updated ${formatDate(course.updatedAt)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(course)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-700 transition hover:bg-blue-50"
                      aria-label={`Edit ${course.title}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(course.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-red-700 transition hover:bg-red-50"
                      aria-label={`Delete ${course.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
