import {
  FolderOpen,
  Plus,
  RefreshCw,
  Tag,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "../utils/adminHelpers";

export function AdminOverviewHero({
  latestPublishedBlog,
  categoriesTotal,
  tagsTotal,
  dashboardLoading,
  canManageBlogs,
  onCreate,
  onRefresh,
  onOpenCategories,
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#082f49_0%,_#0f172a_48%,_#155e75_100%)] p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
            <TrendingUp className="h-4 w-4" />
            <span>Editorial Control Center</span>
          </div>

          <h2 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Create, publish, and organize content from one cleaner admin desk.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-200">
            The admin space is now organized around the existing backend:
            blogs, categories, tags, published content, and quick access to the
            next editorial action.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {canManageBlogs ? (
              <>
                <button
                  type="button"
                  onClick={onCreate}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Blog Post</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenCategories}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Manage Categories</span>
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={onRefresh}
              disabled={dashboardLoading}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${dashboardLoading ? "animate-spin" : ""}`}
              />
              <span>{dashboardLoading ? "Refreshing..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              Latest Published Story
            </p>
            <h3 className="mt-3 text-2xl font-black text-white">
              {latestPublishedBlog?.title || "No published story yet"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {latestPublishedBlog?.excerpt ||
                "Publish a story to make it available on the public site."}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              {latestPublishedBlog
                ? `Published ${formatDate(
                    latestPublishedBlog.updatedAt ||
                      latestPublishedBlog.createdAt,
                  )}`
                : "Waiting for first publication"}
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-cyan-200" />
                <p className="text-sm font-semibold text-white">Categories</p>
              </div>
              <p className="mt-3 text-3xl font-black text-white">
                {categoriesTotal}
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-cyan-200" />
                <p className="text-sm font-semibold text-white">Tags</p>
              </div>
              <p className="mt-3 text-3xl font-black text-white">{tagsTotal}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
