import { CheckCircle2, ShieldCheck, UserPlus, XCircle } from "lucide-react";
import { ADMIN_ROLES } from "../constants";

function roleLabel(value) {
  return ADMIN_ROLES.find((role) => role.value === value)?.label || value;
}

export function TeamManagementPanel({
  teamMembers,
  teamForm,
  loading,
  onFieldChange,
  onSubmit,
  onRoleChange,
  onApprovalChange,
  onStatusChange,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Add Team Member</h2>
            <p className="mt-1 text-sm text-slate-500">
              New members stay unapproved until a super admin enables blogging.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {[
            ["name", "Full Name", "text"],
            ["displayName", "Display Name", "text"],
            ["email", "Email", "email"],
            ["password", "Temporary Password", "password"],
            ["profilePicture", "Profile Image URL", "url"],
          ].map(([field, label, type]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
              </span>
              <input
                type={type}
                required={["name", "displayName", "email", "password"].includes(field)}
                value={teamForm[field]}
                onChange={(event) => onFieldChange(field, event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </span>
            <select
              value={teamForm.role}
              onChange={(event) => onFieldChange("role", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            >
              {ADMIN_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Short Bio
            </span>
            <textarea
              rows={3}
              value={teamForm.shortBio}
              onChange={(event) => onFieldChange("shortBio", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Team Member"}
          </button>
        </div>
      </form>

      <section className="rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">Role Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Approve who can write blogs and keep inactive accounts locked out.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {!teamMembers.items.length ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No team members found.
            </div>
          ) : (
            teamMembers.items.map((member) => (
              <article key={member.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-950">
                        {member.displayName || member.name}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {roleLabel(member.role)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          member.isVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {member.isVerified ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                        {member.isVerified ? "Approved" : "Needs approval"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          member.isActive
                            ? "bg-cyan-50 text-cyan-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {member.isActive ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{member.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={member.role}
                      onChange={(event) => onRoleChange(member.id, event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {ADMIN_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => onApprovalChange(member.id, !member.isVerified)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {member.isVerified ? "Remove Approval" : "Approve Blog"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusChange(member.id, !member.isActive)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {member.isActive ? "Deactivate" : "Activate"}
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
