import { useMemo, useState } from "react";
import {
  Edit2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { BLOG_STATUS_FILTERS } from "../constants";
import {
  formatDate,
  getBlogTagIds,
  resolveCategoryName,
} from "../utils/adminHelpers";

function statusClassName(status) {
  if (status === "PUBLISHED") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "DRAFT") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function BlogsTable({
  blogs,
  categories,
  dashboardLoading,
  canManageBlogs,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const categoryMap = useMemo(
    () =>
      new Map(
        categories.items.map((category) => [String(category.id), category.name]),
      ),
    [categories.items],
  );
  const blogCounts = useMemo(
    () => ({
      ALL: blogs.items.length,
      PUBLISHED: blogs.items.filter((blog) => blog.status === "PUBLISHED")
        .length,
      DRAFT: blogs.items.filter((blog) => blog.status === "DRAFT").length,
      ARCHIVED: blogs.items.filter((blog) => blog.status === "ARCHIVED")
        .length,
    }),
    [blogs.items],
  );
  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return blogs.items.filter((blog) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : blog.status === statusFilter;
      const matchesSearch = normalizedSearch
        ? [
            blog.title,
            blog.slug,
            blog.excerpt,
            resolveCategoryName(blog, categoryMap),
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedSearch),
            )
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [blogs.items, categoryMap, searchTerm, statusFilter]);

  return (
    <section className="rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">Blog Content Desk</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review, search, open live posts, and move quickly between draft and
            published content.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={dashboardLoading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{dashboardLoading ? "Refreshing..." : "Refresh"}</span>
          </button>
          {canManageBlogs ? (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Blog Post</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {BLOG_STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label} ({blogCounts[filter.value] || 0})
              </button>
            );
          })}
        </div>

        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            placeholder="Search by title, slug, excerpt, or category"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4">Display Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {!filteredBlogs.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-sm text-slate-500"
                >
                  {dashboardLoading
                    ? "Loading blog posts..."
                    : "No blog posts match the current filter."}
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="align-top hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {blog.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {blog.slug}
                        </p>
                        <p className="mt-2 line-clamp-2 max-w-md text-xs leading-6 text-slate-500">
                          {blog.excerpt || "No excerpt available for this post."}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {resolveCategoryName(blog, categoryMap)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                        blog.status,
                      )}`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {getBlogTagIds(blog).length} tag
                    {getBlogTagIds(blog).length === 1 ? "" : "s"}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {formatDate(blog.publishedAt || blog.updatedAt || blog.createdAt)}
                    {blog.sourceName ? (
                      <span className="mt-1 block text-xs text-slate-400">
                        Imported from {blog.sourceName}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {blog.status === "PUBLISHED" ? (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-cyan-700 transition hover:bg-cyan-50"
                          aria-label={`Open ${blog.title}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-300"
                          title="Only published posts can be opened on the public site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      )}
                      {canManageBlogs ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(blog)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-700 transition hover:bg-blue-50"
                            aria-label={`Edit ${blog.title}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(blog.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-red-700 transition hover:bg-red-50"
                            aria-label={`Delete ${blog.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
