import { LoaderCircle } from "lucide-react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { ADMIN_VIEWS } from "../constants";
import { useAdminAccess } from "../hooks/useAdminAccess";
import { AdminAccessGate } from "../components/AdminAccessGate";
import { AdminHeader } from "../components/AdminHeader";
import { AdminLoginView } from "../components/AdminLoginView";
import { AdminTabs } from "../components/AdminTabs";
import { AdminOverviewHero } from "../components/AdminOverviewHero";
import { BlogEditor } from "../components/BlogEditor";
import { BlogsTable } from "../components/BlogsTable";
import { CategoriesPanel } from "../components/CategoriesPanel";
import { CampusInfoImporterPanel } from "../components/CampusInfoImporterPanel";
import { CoursesPanel } from "../components/CoursesPanel";
import { FeedbackPanel } from "../components/FeedbackPanel";
import { FinancePanel } from "../components/FinancePanel";
import { NoticeBanner } from "../components/NoticeBanner";
import { StatsGrid } from "../components/StatsGrid";
import { StudentPlatformPanel } from "../components/StudentPlatformPanel";
import { StudentPortalAdminPanel } from "../components/StudentPortalAdminPanel";
import { TagsPanel } from "../components/TagsPanel";
import { TeamManagementPanel } from "../components/TeamManagementPanel";
import { useAdminPanel } from "../hooks/useAdminPanel";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-cyan-400" />
        <p className="mt-4 text-sm font-medium text-slate-300">
          Restoring admin session...
        </p>
      </div>
    </div>
  );
}

export function AdminPage() {
  useDocumentTitle("CampyTech Gist | Admin");
  const { checkingAccess, hasAccess, detectedIp, whitelistEnabled } =
    useAdminAccess();
  const {
    isLoggedIn,
    currentView,
    showPassword,
    isSuperAdmin,
    canManageBlogs,
    loginData,
    blogForm,
    categoryForm,
    tagForm,
    teamForm,
    financeForm,
    importForm,
    courseForm,
    blogs,
    blogItems,
    categories,
    tags,
    teamMembers,
    financeEntries,
    financeSummary,
    feedbackItems,
    feedbackSummary,
    courses,
    studentPlatformSettings,
    editingBlog,
    editingCategory,
    editingTag,
    editingFinanceEntry,
    editingCourse,
    loading,
    dashboardLoading,
    bootstrapping,
    uploadingImage,
    uploadingReceipt,
    importingDrafts,
    error,
    success,
    stats,
    latestPublishedBlog,
    authToken,
    canUploadImages,
    setShowPassword,
    setLoginData,
    setBlogForm,
    setCategoryForm,
    setTagForm,
    setTeamForm,
    setFinanceForm,
    setImportForm,
    setCourseForm,
    setCurrentView,
    setError,
    setSuccess,
    handleLogin,
    handleLogout,
    handleSaveBlog,
    handleBlogImageUpload,
    handleFinanceReceiptUpload,
    handleDeleteBlog,
    handleEditBlog,
    handleSaveCategory,
    handleDeleteCategory,
    handleEditCategory,
    handleSaveTag,
    handleDeleteTag,
    handleEditTag,
    handleCreateTeamMember,
    handleUpdateTeamRole,
    handleToggleTeamApproval,
    handleToggleTeamStatus,
    handleSaveFinanceEntry,
    handleEditFinanceEntry,
    handleDeleteFinanceEntry,
    handleImportCampusInfo,
    handleUpdateFeedback,
    handleDeleteFeedback,
    handleSaveCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleToggleStudentPlatform,
    openCreateView,
    resetForm,
    resetCategoryForm,
    resetTagForm,
    resetFinanceForm,
    resetCourseForm,
    refreshDashboard,
  } = useAdminPanel();

  let content = null;

  if (bootstrapping) {
    content = <LoadingScreen />;
  } else if (!isLoggedIn) {
    content = (
      <AdminLoginView
        loginData={loginData}
        showPassword={showPassword}
        loading={loading}
        error={error}
        onSubmit={handleLogin}
        onLoginChange={(field, value) =>
          setLoginData((previousState) => ({
            ...previousState,
            [field]: value,
          }))
        }
        onTogglePassword={() => setShowPassword((value) => !value)}
      />
    );
  } else {
    content = (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)]">
        <AdminHeader onLogout={handleLogout} />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {error && (
              <NoticeBanner
                tone="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            {success && (
              <NoticeBanner
                tone="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            )}

            <AdminTabs
              currentView={currentView}
              editingBlog={editingBlog}
              isSuperAdmin={isSuperAdmin}
              canManageBlogs={canManageBlogs}
              totals={{
                blogs: blogs.total || blogItems.length,
                categories: categories.total || categories.items.length,
                tags: tags.total || tags.items.length,
                team: teamMembers.total || teamMembers.items.length,
                feedback: feedbackItems.total || feedbackItems.items.length,
                courses: courses.total || courses.items.length,
              }}
              onOpenDashboard={() => {
                setCurrentView(ADMIN_VIEWS.DASHBOARD);
                resetForm();
                resetCategoryForm();
                resetTagForm();
                resetCourseForm();
              }}
              onOpenEditor={openCreateView}
              onOpenCategories={() => {
                setCurrentView(ADMIN_VIEWS.CATEGORIES);
                resetCategoryForm();
              }}
              onOpenTags={() => {
                setCurrentView(ADMIN_VIEWS.TAGS);
                resetTagForm();
              }}
              onOpenTeam={() => setCurrentView(ADMIN_VIEWS.TEAM)}
              onOpenFinances={() => {
                setCurrentView(ADMIN_VIEWS.FINANCES);
                resetFinanceForm();
              }}
              onOpenImporter={() => setCurrentView(ADMIN_VIEWS.IMPORTER)}
              onOpenFeedback={() => setCurrentView(ADMIN_VIEWS.FEEDBACK)}
              onOpenCourses={() => {
                setCurrentView(ADMIN_VIEWS.COURSES);
                resetCourseForm();
              }}
              onOpenStudentPlatform={() =>
                setCurrentView(ADMIN_VIEWS.STUDENT_PLATFORM)
              }
              onOpenStudents={() => setCurrentView(ADMIN_VIEWS.STUDENTS)}
            />

            {isLoggedIn && !canManageBlogs ? (
              <NoticeBanner
                tone="error"
                message="Your admin account can view dashboard and feedback. Finance, blog publishing, course management, and import tools are super-admin only."
              />
            ) : null}

            {currentView === ADMIN_VIEWS.DASHBOARD ? (
              <div className="space-y-6">
                <AdminOverviewHero
                  latestPublishedBlog={latestPublishedBlog}
                  categoriesTotal={categories.total || categories.items.length}
                  tagsTotal={tags.total || tags.items.length}
                  dashboardLoading={dashboardLoading}
                  canManageBlogs={canManageBlogs}
                  onCreate={openCreateView}
                  onRefresh={refreshDashboard}
                  onOpenCategories={() =>
                    setCurrentView(ADMIN_VIEWS.CATEGORIES)
                  }
                />
                <StatsGrid stats={stats} />
                <BlogsTable
                  blogs={blogs}
                  categories={categories}
                  dashboardLoading={dashboardLoading}
                  canManageBlogs={canManageBlogs}
                  onRefresh={refreshDashboard}
                  onCreate={openCreateView}
                  onEdit={handleEditBlog}
                  onDelete={handleDeleteBlog}
                />
              </div>
            ) : null}

            {currentView === ADMIN_VIEWS.EDITOR && canManageBlogs ? (
              <BlogEditor
                blogForm={blogForm}
                categories={categories}
                tags={tags}
                editingBlog={editingBlog}
                loading={loading}
                uploadingImage={uploadingImage}
                canUploadImages={canUploadImages}
                onFieldChange={(field, value) =>
                  setBlogForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onImageUpload={handleBlogImageUpload}
                onSubmit={handleSaveBlog}
                onCancel={() => {
                  setCurrentView(ADMIN_VIEWS.DASHBOARD);
                  resetForm();
                }}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.CATEGORIES && canManageBlogs ? (
              <CategoriesPanel
                categories={categories}
                blogs={blogItems}
                categoryForm={categoryForm}
                editingCategory={editingCategory}
                loading={loading}
                onFieldChange={(field, value) =>
                  setCategoryForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onSubmit={handleSaveCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onReset={resetCategoryForm}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.TAGS && canManageBlogs ? (
              <TagsPanel
                tags={tags}
                blogs={blogItems}
                tagForm={tagForm}
                editingTag={editingTag}
                loading={loading}
                onFieldChange={(field, value) =>
                  setTagForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onSubmit={handleSaveTag}
                onEdit={handleEditTag}
                onDelete={handleDeleteTag}
                onReset={resetTagForm}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.FEEDBACK ? (
              <FeedbackPanel
                feedbackItems={feedbackItems}
                feedbackSummary={feedbackSummary}
                loading={loading}
                onUpdate={handleUpdateFeedback}
                onDelete={handleDeleteFeedback}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.TEAM && isSuperAdmin ? (
              <TeamManagementPanel
                teamMembers={teamMembers}
                teamForm={teamForm}
                loading={loading}
                onFieldChange={(field, value) =>
                  setTeamForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onSubmit={handleCreateTeamMember}
                onRoleChange={handleUpdateTeamRole}
                onApprovalChange={handleToggleTeamApproval}
                onStatusChange={handleToggleTeamStatus}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.STUDENT_PLATFORM && isSuperAdmin ? (
              <StudentPlatformPanel
                settings={studentPlatformSettings}
                loading={loading || dashboardLoading}
                isSuperAdmin={isSuperAdmin}
                onToggle={handleToggleStudentPlatform}
                onRefresh={refreshDashboard}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.STUDENTS && isSuperAdmin ? (
              <StudentPortalAdminPanel token={authToken} />
            ) : null}

            {currentView === ADMIN_VIEWS.FINANCES && isSuperAdmin ? (
              <FinancePanel
                financeSummary={financeSummary}
                financeEntries={financeEntries}
                financeForm={financeForm}
                editingFinanceEntry={editingFinanceEntry}
                loading={loading}
                uploadingReceipt={uploadingReceipt}
                canUploadReceipts={canUploadImages}
                onFieldChange={(field, value) =>
                  setFinanceForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onReceiptUpload={handleFinanceReceiptUpload}
                onSubmit={handleSaveFinanceEntry}
                onEdit={handleEditFinanceEntry}
                onDelete={handleDeleteFinanceEntry}
                onReset={resetFinanceForm}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.COURSES && isSuperAdmin ? (
              <CoursesPanel
                courses={courses}
                courseForm={courseForm}
                editingCourse={editingCourse}
                loading={loading}
                onFieldChange={(field, value) =>
                  setCourseForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onSubmit={handleSaveCourse}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onReset={resetCourseForm}
              />
            ) : null}

            {currentView === ADMIN_VIEWS.IMPORTER && isSuperAdmin ? (
              <CampusInfoImporterPanel
                categories={categories}
                importForm={importForm}
                importingDrafts={importingDrafts}
                onFieldChange={(field, value) =>
                  setImportForm((previousState) => ({
                    ...previousState,
                    [field]: value,
                  }))
                }
                onSubmit={handleImportCampusInfo}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAccessGate
      checkingAccess={checkingAccess}
      hasAccess={hasAccess}
      whitelistEnabled={whitelistEnabled}
      detectedIp={detectedIp}
    >
      {content}
    </AdminAccessGate>
  );
}
