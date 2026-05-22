import { DownloadCloud, LoaderCircle } from "lucide-react";
import { IMPORT_SOURCES } from "../constants";

export function CampusInfoImporterPanel({
  categories,
  importForm,
  importingDrafts,
  onFieldChange,
  onSubmit,
}) {
  const selectedSource = IMPORT_SOURCES.find(
    (source) => source.value === importForm.sourceKey,
  );

  return (
    <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <DownloadCloud className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-950">
            External Draft Importer
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Pull recent scholarship, opportunity, and African tech stories into
            backend drafts with duplicate source checks before publishing.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5 lg:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Source
          </span>
          <select
            value={importForm.sourceKey}
            onChange={(event) => onFieldChange("sourceKey", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          >
            {IMPORT_SOURCES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Number of Drafts
          </span>
          <input
            type="number"
            min="1"
            max="30"
            value={importForm.limit}
            onChange={(event) => onFieldChange("limit", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Default Category
          </span>
          <select
            value={importForm.categoryId}
            onChange={(event) => onFieldChange("categoryId", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">Use scraped categories</option>
            {categories.items.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Source URL
          </span>
          <input
            type="url"
            value={importForm.sourceUrl}
            onChange={(event) => onFieldChange("sourceUrl", event.target.value)}
            placeholder={selectedSource?.url || "https://example.com/"}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </label>

        <div className="lg:col-span-4">
          <button
            type="submit"
            disabled={importingDrafts}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {importingDrafts ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadCloud className="h-4 w-4" />
            )}
            <span>{importingDrafts ? "Importing Drafts..." : "Import Drafts"}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
