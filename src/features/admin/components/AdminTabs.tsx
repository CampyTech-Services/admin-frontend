import {
  BookOpenCheck,
  DownloadCloud,
  FileText,
  FolderOpen,
  Lightbulb,
  PenSquare,
  Rocket,
  Tags,
  Users,
  WalletCards,
} from "lucide-react";
import { ADMIN_VIEWS } from "../constants";

export function AdminTabs({
  currentView,
  editingBlog,
  isSuperAdmin,
  canManageBlogs,
  totals,
  onOpenDashboard,
  onOpenEditor,
  onOpenCategories,
  onOpenTags,
  onOpenTeam,
  onOpenFinances,
  onOpenImporter,
  onOpenFeedback,
  onOpenCourses,
  onOpenStudentPlatform,
}) {
  const tabs = [
    {
      id: ADMIN_VIEWS.DASHBOARD,
      label: "Overview",
      helper: `${totals.blogs} blogs`,
      icon: FileText,
      onClick: onOpenDashboard,
    },
    {
      id: ADMIN_VIEWS.FEEDBACK,
      label: "Feedback",
      helper: `${totals.feedback || 0} requests`,
      icon: Lightbulb,
      onClick: onOpenFeedback,
    },
    ...(canManageBlogs
      ? [
          {
            id: ADMIN_VIEWS.EDITOR,
            label: editingBlog ? "Edit Blog" : "Create Blog",
            helper: editingBlog ? "Update current story" : "Write something new",
            icon: PenSquare,
            onClick: onOpenEditor,
          },
          {
            id: ADMIN_VIEWS.CATEGORIES,
            label: "Categories",
            helper: `${totals.categories} groups`,
            icon: FolderOpen,
            onClick: onOpenCategories,
          },
          {
            id: ADMIN_VIEWS.TAGS,
            label: "Tags",
            helper: `${totals.tags} labels`,
            icon: Tags,
            onClick: onOpenTags,
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            id: ADMIN_VIEWS.STUDENT_PLATFORM,
            label: "Student OS",
            helper: "Launch switch",
            icon: Rocket,
            onClick: onOpenStudentPlatform,
          },
          {
            id: ADMIN_VIEWS.TEAM,
            label: "Team",
            helper: `${totals.team || 0} members`,
            icon: Users,
            onClick: onOpenTeam,
          },
          {
            id: ADMIN_VIEWS.FINANCES,
            label: "Finances",
            helper: "Ledger",
            icon: WalletCards,
            onClick: onOpenFinances,
          },
          {
            id: ADMIN_VIEWS.COURSES,
            label: "Courses",
            helper: `${totals.courses || 0} courses`,
            icon: BookOpenCheck,
            onClick: onOpenCourses,
          },
          {
            id: ADMIN_VIEWS.IMPORTER,
            label: "Importer",
            helper: "Draft scraper",
            icon: DownloadCloud,
            onClick: onOpenImporter,
          },
        ]
      : []),
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              className={`flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-left transition ${
                isActive
                  ? "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_18px_50px_rgba(6,182,212,0.12)]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <div>
                <p className="text-sm font-black">{tab.label}</p>
                <p
                  className={`mt-1 text-xs font-semibold ${
                    isActive ? "text-cyan-700/80" : "text-slate-400"
                  }`}
                >
                  {tab.helper}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  isActive
                    ? "bg-white text-cyan-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </button>
          );
        })}
    </div>
  );
}
