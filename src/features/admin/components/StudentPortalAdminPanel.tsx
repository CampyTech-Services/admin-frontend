import { useEffect, useMemo, useState } from "react";
import {
  getAdmissionApplications,
  getMarketplaceListings,
  getMarketplaceOrders,
  getRegisteredStudents,
  getStudentTransactions,
  sendPersonalizedStudentEmail,
  updateAdmissionApplicationStatus,
  updateMarketplaceListingStatus,
  updateMarketplaceOrderStatus,
  updateRegisteredStudentVerification,
} from "../services/adminApi";

const profileStatuses = ["PENDING", "VERIFIED", "REJECTED"];
const marketplaceStatuses = ["PENDING_REVIEW", "ACTIVE", "REJECTED", "ARCHIVED"];
const marketplaceOrderStatuses = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
];
const admissionStatuses = [
  "SUBMITTED",
  "IN_REVIEW",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "OFFER_SECURED",
  "REJECTED",
  "CLOSED",
];

export function StudentPortalAdminPanel({ token }) {
  const [students, setStudents] = useState({ items: [], total: 0 });
  const [applications, setApplications] = useState({ items: [], total: 0 });
  const [transactions, setTransactions] = useState({ items: [], total: 0 });
  const [marketplaceListings, setMarketplaceListings] = useState({
    items: [],
    total: 0,
  });
  const [marketplaceOrders, setMarketplaceOrders] = useState({
    items: [],
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [emailForm, setEmailForm] = useState({
    studentId: "",
    subject: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totals = useMemo(
    () => [
      { label: "Students", value: students.total || students.items.length },
      {
        label: "Applications",
        value: applications.total || applications.items.length,
      },
      {
        label: "Transactions",
        value: transactions.total || transactions.items.length,
      },
      {
        label: "Marketplace",
        value: marketplaceListings.total || marketplaceListings.items.length,
      },
    ],
    [
      applications.items.length,
      applications.total,
      marketplaceListings.items.length,
      marketplaceListings.total,
      students.items.length,
      students.total,
      transactions.items.length,
      transactions.total,
    ],
  );

  useEffect(() => {
    loadData();
  }, [token]);

  async function loadData() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [
        studentData,
        applicationData,
        transactionData,
        listingData,
        orderData,
      ] =
        await Promise.all([
          getRegisteredStudents(token, search.trim() ? { search: search.trim() } : {}),
          getAdmissionApplications(token),
          getStudentTransactions(token),
          getMarketplaceListings(token),
          getMarketplaceOrders(token),
        ]);
      setStudents(studentData);
      setApplications(applicationData);
      setTransactions(transactionData);
      setMarketplaceListings(listingData);
      setMarketplaceOrders(orderData);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load student audit data.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    loadData();
  }

  async function updateStudentStatus(studentId, profileStatus) {
    try {
      await updateRegisteredStudentVerification(token, studentId, {
        profileStatus,
      });
      setMessage("Student profile updated.");
      await loadData();
    } catch (statusError) {
      setError(
        statusError?.response?.data?.message ||
          statusError?.message ||
          "Unable to update student profile.",
      );
    }
  }

  async function updateAdmissionStatus(applicationId, status) {
    try {
      await updateAdmissionApplicationStatus(token, applicationId, { status });
      setMessage("Admission status updated.");
      await loadData();
    } catch (statusError) {
      setError(
        statusError?.response?.data?.message ||
          statusError?.message ||
          "Unable to update admission status.",
      );
    }
  }

  async function updateListingStatus(listingId, status) {
    try {
      await updateMarketplaceListingStatus(token, listingId, { status });
      setMessage("Marketplace listing updated.");
      await loadData();
    } catch (listingError) {
      setError(
        listingError?.response?.data?.message ||
          listingError?.message ||
          "Unable to update marketplace listing.",
      );
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await updateMarketplaceOrderStatus(token, orderId, { status });
      setMessage("Marketplace order updated.");
      await loadData();
    } catch (orderError) {
      setError(
        orderError?.response?.data?.message ||
          orderError?.message ||
          "Unable to update marketplace order.",
      );
    }
  }

  async function sendEmail(event) {
    event.preventDefault();
    setError("");
    try {
      await sendPersonalizedStudentEmail(token, emailForm);
      setMessage("Personalized email queued through the notification provider.");
      setEmailForm({ studentId: "", subject: "", body: "" });
      await loadData();
    } catch (emailError) {
      setError(
        emailError?.response?.data?.message ||
          emailError?.message ||
          "Unable to send student email.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
              Student Operations
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Profiles, admission processing, emails, and transactions
            </h2>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {message ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone, school, or course"
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Search students
          </button>
        </form>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {totals.map((total) => (
            <div key={total.label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">
                {total.label}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {total.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            Registered students
          </h3>
          <div className="mt-4 space-y-3">
            {students.items.map((student) => (
              <article
                key={student.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black text-slate-950">
                      {student.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {student.email} / {student.schoolName || "No school yet"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span
                        className={`rounded-full px-3 py-1 ${
                          student.emailVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {student.emailVerified ? "Email verified" : "Email not verified"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Applications {student.audit?.admissionApplications || 0}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Listings {student.audit?.marketplaceListings || 0}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Saved {student.audit?.savedBlogs || 0}
                      </span>
                    </div>
                  </div>
                  <select
                    value={student.profileStatus}
                    onChange={(event) =>
                      updateStudentStatus(student.id, event.target.value)
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    {profileStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>

        <form
          onSubmit={sendEmail}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-xl font-black text-slate-950">
            Send personalized email
          </h3>
          <div className="mt-4 space-y-3">
            <select
              value={emailForm.studentId}
              onChange={(event) =>
                setEmailForm((current) => ({
                  ...current,
                  studentId: event.target.value,
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              <option value="">Select student</option>
              {students.items.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                  disabled={!student.emailVerified}
                >
                  {student.fullName} - {student.email}
                  {student.emailVerified ? "" : " (unverified email)"}
                </option>
              ))}
            </select>
            <input
              value={emailForm.subject}
              onChange={(event) =>
                setEmailForm((current) => ({
                  ...current,
                  subject: event.target.value,
                }))
              }
              required
              placeholder="Subject"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
            <textarea
              value={emailForm.body}
              onChange={(event) =>
                setEmailForm((current) => ({
                  ...current,
                  body: event.target.value,
                }))
              }
              required
              rows={8}
              placeholder="Personalized message"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Send email
            </button>
          </div>
        </form>
      </div>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-slate-950">
          Admission applications
        </h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {applications.items.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <p className="font-black text-slate-950">
                {application.surname} {application.otherNames}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {application.schoolName} / {application.course}
              </p>
              <select
                value={application.status}
                onChange={(event) =>
                  updateAdmissionStatus(application.id, event.target.value)
                }
                className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {admissionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-slate-950">
          Marketplace audit
        </h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {marketplaceListings.items.map((listing) => (
            <article
              key={listing.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <p className="font-black text-slate-950">{listing.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {listing.user?.fullName || "Student seller"} /{" "}
                {listing.currency} {Number(listing.price || 0).toLocaleString()}
              </p>
              <select
                value={listing.status}
                onChange={(event) =>
                  updateListingStatus(listing.id, event.target.value)
                }
                className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {marketplaceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </article>
          ))}
          {!marketplaceListings.items.length ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500">
              No marketplace listings found.
            </p>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
              <tr>
                <th className="py-3 pr-4">Item</th>
                <th className="py-3 pr-4">Buyer</th>
                <th className="py-3 pr-4">Seller</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceOrders.items.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-950">
                    {order.listing?.title || "Marketplace item"}
                  </td>
                  <td className="py-3 pr-4">{order.buyer?.email}</td>
                  <td className="py-3 pr-4">{order.seller?.email}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      {marketplaceOrderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-slate-950">
          Provider transactions
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
              <tr>
                <th className="py-3 pr-4">Reference</th>
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.items.map((transaction) => (
                <tr key={transaction.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-950">
                    {transaction.reference}
                  </td>
                  <td className="py-3 pr-4">{transaction.productType}</td>
                  <td className="py-3 pr-4">{transaction.customerEmail}</td>
                  <td className="py-3 pr-4">
                    {transaction.currency} {Number(transaction.amount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
