import { PencilLine, Save, Tag, Trash2, X } from "lucide-react";
import { countBlogsForTag, countPublishedBlogsForTag } from "../utils/adminHelpers";

export function TagsPanel({
  tags,
  blogs,
  tagForm,
  editingTag,
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {editingTag ? "Edit Tag" : "Create Tag"}
            </h2>
            <p className="text-sm text-slate-500">
              Keep article labeling consistent across the admin desk.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Tag Name
            </span>
            <input
              type="text"
              required
              value={tagForm.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Admissions"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Slug
            </span>
            <input
              type="text"
              required
              value={tagForm.slug}
              onChange={(event) => onFieldChange("slug", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="admissions"
            />
          </label>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>
                {loading
                  ? "Saving..."
                  : editingTag
                    ? "Update Tag"
                    : "Create Tag"}
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
          <h2 className="text-2xl font-black text-slate-950">Tags Library</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Tags help connect related posts and sharpen the editorial taxonomy.
          </p>
        </div>

        {!tags.items.length ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            No tags found yet. Create your first tag to start labeling content.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tags.items.map((tag) => {
              const totalBlogs = countBlogsForTag(blogs, tag.id);
              const publishedBlogs = countPublishedBlogsForTag(blogs, tag.id);

              return (
                <article
                  key={tag.id}
                  className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <Tag className="h-3.5 w-3.5" />
                        <span>{tag.name}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        {tag.slug}
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {totalBlogs} posts
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Used in {publishedBlogs} published post
                    {publishedBlogs === 1 ? "" : "s"}.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(tag)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(tag.id)}
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
