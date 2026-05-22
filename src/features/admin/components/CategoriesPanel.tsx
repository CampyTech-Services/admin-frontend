import {
  FolderOpen,
  PencilLine,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  countBlogsForCategory,
  countPublishedBlogsForCategory,
} from "../utils/adminHelpers";

export function CategoriesPanel({
  categories,
  blogs,
  categoryForm,
  editingCategory,
  loading,
  onFieldChange,
  onSubmit,
  onEdit,
  onDelete,
  onReset,
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[23rem_minmax(0,1fr)]">
      <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 xl:sticky xl:top-6 xl:self-start">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>
            <p className="text-sm text-slate-500">
              Organize public blog navigation and editorial grouping.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Category Name
            </span>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Scholarships"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Slug
            </span>
            <input
              type="text"
              required
              value={categoryForm.slug}
              onChange={(event) => onFieldChange("slug", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="scholarships"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              rows={5}
              value={categoryForm.description}
              onChange={(event) =>
                onFieldChange("description", event.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              placeholder="Short note describing what belongs in this category."
            />
          </label>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>
                {loading
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              <span>Clear Form</span>
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Categories Overview
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Review how each category is being used across published and draft
            content.
          </p>
        </div>

        {!categories.items.length ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            No categories found yet. Create your first category to get started.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {categories.items.map((category) => {
              const totalBlogs = countBlogsForCategory(blogs, category.id);
              const publishedBlogs = countPublishedBlogsForCategory(
                blogs,
                category.id,
              );

              return (
                <article
                  key={category.id}
                  className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {category.description ||
                          "No description has been added for this category yet."}
                      </p>
                    </div>
                    <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {totalBlogs} posts
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Slug: {category.slug}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {publishedBlogs} published
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
