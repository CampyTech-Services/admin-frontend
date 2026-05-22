import { LoaderCircle, LockKeyhole, ShieldAlert } from "lucide-react";

function AccessCheckView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.2),_transparent_30%),linear-gradient(180deg,_#e0f2fe_0%,_#f8fafc_45%,_#e2e8f0_100%)] px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_100px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/80">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-slate-950">
          Verifying Admin Access
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Checking the configured IP access rules for this admin area.
        </p>
      </div>
    </div>
  );
}

function AccessDeniedView({ detectedIp }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.18),_transparent_30%),linear-gradient(180deg,_#fff1f2_0%,_#fff7ed_48%,_#f8fafc_100%)] px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,0.14)] ring-1 ring-rose-100 sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-950">
          Access Denied
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This admin page is currently restricted to approved IP addresses.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-rose-100 bg-rose-50/70 p-5">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-rose-600" />
            <p className="text-sm font-semibold text-rose-700">
              Public IP detected: {detectedIp || "Unavailable"}
            </p>
          </div>
          <p className="mt-3 text-sm leading-7 text-rose-700/90">
            If this IP should be allowed, add it to
            <code className="mx-1 rounded bg-white px-2 py-1 text-xs">
              NEXT_PUBLIC_ADMIN_ALLOWED_IPS
            </code>
            and redeploy the frontend.
          </p>
        </div>

        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}

export function AdminAccessGate({
  checkingAccess,
  hasAccess,
  whitelistEnabled,
  detectedIp,
  children,
}) {
  if (!whitelistEnabled) {
    return children;
  }

  if (checkingAccess) {
    return <AccessCheckView />;
  }

  if (!hasAccess) {
    return <AccessDeniedView detectedIp={detectedIp} />;
  }

  return children;
}
