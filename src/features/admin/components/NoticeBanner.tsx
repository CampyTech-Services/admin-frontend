import { CheckCircle2, TriangleAlert, X } from "lucide-react";

export function NoticeBanner({ tone, message, onClose = null }) {
  const isSuccess = tone === "success";

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <TriangleAlert className="h-5 w-5" />
        )}
        <span>{message}</span>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 transition hover:bg-black/5"
          aria-label="Dismiss notice"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
