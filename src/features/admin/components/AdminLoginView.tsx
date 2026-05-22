import { Eye, EyeOff, LockKeyhole, Mail, Shield } from "lucide-react";

export function AdminLoginView({
  loginData,
  showPassword,
  loading,
  error,
  onSubmit,
  onLoginChange,
  onTogglePassword,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_35%),linear-gradient(180deg,_#ecfeff_0%,_#f8fafc_38%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.3)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              <Shield className="h-4 w-4" />
              <span>CampyTech Gist Admin</span>
            </div>
            <h1 className="mt-8 text-5xl font-black tracking-tight">
              Manage stories with a cleaner editorial workflow.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              This admin area is structured for real work: secure login,
              dashboard overview, content editing, publishing control, and
              simpler issue tracing when the backend shape changes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Editorial Control
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Draft, publish, and archive flows are separated cleanly.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                API Ready
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Auth and admin requests run through a dedicated service layer.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)] ring-1 ring-slate-200 sm:p-10">
            <div className="mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,_#06b6d4_0%,_#2563eb_100%)] text-white shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-black text-slate-950">
                Admin Login
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Sign in to manage CampyTech Gist content and publishing.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(event) =>
                      onLoginChange("email", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-12 py-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    placeholder="admin@campytechgist.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(event) =>
                      onLoginChange("password", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-12 py-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
