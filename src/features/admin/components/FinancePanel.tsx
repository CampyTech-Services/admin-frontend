import { Edit2, ExternalLink, PlusCircle, Trash2, UploadCloud, WalletCards } from "lucide-react";
import {
  FINANCE_ENTRY_GROUPS,
  FINANCE_ENTRY_STATUSES,
  FINANCE_ENTRY_TYPES,
} from "../constants";
import { formatCurrency, formatDate } from "../utils/adminHelpers";

function statusClassName(status) {
  if (status === "CONFIRMED") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

export function FinancePanel({
  financeSummary,
  financeEntries,
  financeForm,
  editingFinanceEntry,
  loading,
  uploadingReceipt,
  canUploadReceipts,
  onFieldChange,
  onReceiptUpload,
  onSubmit,
  onEdit,
  onDelete,
  onReset,
}) {
  const summary = financeSummary || {
    income: 0,
    expenses: 0,
    balance: 0,
    pending: 0,
    assets: 0,
    savings: 0,
    loans: 0,
    revenue: 0,
    receiptsCount: 0,
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
      <div className="space-y-5">
        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Finance Overview</h2>
              <p className="mt-1 text-sm text-slate-300">
                Confirmed income and expenses visible to super admins.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Revenue", summary.revenue || summary.income],
              ["Expenses", summary.expenses],
              ["Balance", summary.balance],
              ["Assets", summary.assets],
              ["Savings", summary.savings],
              ["Loans", summary.loans],
              ["Pending", summary.pending],
              ["Receipts", summary.receiptsCount || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">
                  {label === "Receipts" ? value : formatCurrency(value)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <form
          onSubmit={onSubmit}
          className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                {editingFinanceEntry ? "Edit Entry" : "New Finance Entry"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track income, expenses, and pending payments.
              </p>
            </div>
            <PlusCircle className="h-5 w-5 text-cyan-600" />
          </div>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </span>
              <input
                type="text"
                required
                value={financeForm.title}
                onChange={(event) => onFieldChange("title", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Type
                </span>
                <select
                  value={financeForm.type}
                  onChange={(event) => onFieldChange("type", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                >
                  {FINANCE_ENTRY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Ledger Group
                </span>
                <select
                  value={financeForm.group}
                  onChange={(event) => onFieldChange("group", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                >
                  {FINANCE_ENTRY_GROUPS.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={financeForm.amount}
                  onChange={(event) => onFieldChange("amount", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Startup / Business Unit
                </span>
                <input
                  type="text"
                  value={financeForm.startupName}
                  onChange={(event) => onFieldChange("startupName", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </span>
                <select
                  value={financeForm.status}
                  onChange={(event) => onFieldChange("status", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                >
                  {FINANCE_ENTRY_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Date
                </span>
                <input
                  type="datetime-local"
                  value={financeForm.occurredAt}
                  onChange={(event) => onFieldChange("occurredAt", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </span>
              <input
                type="text"
                value={financeForm.category}
                onChange={(event) => onFieldChange("category", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Counterparty
                </span>
                <input
                  type="text"
                  value={financeForm.counterparty}
                  onChange={(event) => onFieldChange("counterparty", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Reference
                </span>
                <input
                  type="text"
                  value={financeForm.reference}
                  onChange={(event) => onFieldChange("reference", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Receipt URL
              </span>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  value={financeForm.receiptUrl}
                  onChange={(event) => onFieldChange("receiptUrl", event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
                {canUploadReceipts ? (
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    <UploadCloud className="h-4 w-4" />
                    <span>{uploadingReceipt ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingReceipt}
                      onChange={(event) => onReceiptUpload(event.target.files?.[0])}
                    />
                  </label>
                ) : null}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </span>
              <textarea
                rows={3}
                value={financeForm.description}
                onChange={(event) => onFieldChange("description", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : editingFinanceEntry ? "Update Entry" : "Save Entry"}
              </button>
              {editingFinanceEntry ? (
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
      </div>

      <section className="rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">Finance Ledger</h2>
          <p className="mt-1 text-sm text-slate-500">
            The latest income and expense entries.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {!financeEntries.items.length ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No finance entries yet.
            </div>
          ) : (
            financeEntries.items.map((entry) => (
              <article key={entry.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-950">
                        {entry.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          entry.type === "INCOME"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {entry.type}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {entry.group || "REVENUE"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                          entry.status,
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-950">
                      {formatCurrency(entry.amount)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {entry.startupName || "CampyTech"} / {entry.category || "Uncategorized"} / {formatDate(entry.occurredAt)}
                    </p>
                    {(entry.counterparty || entry.reference) ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {[entry.counterparty, entry.reference].filter(Boolean).join(" / ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.receiptUrl ? (
                      <a
                        href={entry.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-cyan-700 transition hover:bg-cyan-50"
                        aria-label={`Open receipt for ${entry.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-700 transition hover:bg-blue-50"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-red-700 transition hover:bg-red-50"
                      aria-label={`Delete ${entry.title}`}
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
