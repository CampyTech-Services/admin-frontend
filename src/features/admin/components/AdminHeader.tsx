import { FileText, LogOut } from "lucide-react";

export function AdminHeader({ onLogout }) {
  return (
    <header className="border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#06b6d4_0%,_#2563eb_100%)] text-white shadow-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950">
              Blog Admin Panel
            </h1>
            <p className="text-sm text-slate-500">CampyTech Gist editorial desk</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
