import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ADMIN_TOKEN_KEY,
  ADMIN_VIEWS,
  EMPTY_BLOG_FORM,
  EMPTY_CATEGORY_FORM,
  EMPTY_COURSE_FORM,
  EMPTY_FINANCE_FORM,
  EMPTY_IMPORT_FORM,
  EMPTY_LOGIN_FORM,
  EMPTY_TAG_FORM,
  EMPTY_TEAM_FORM,
} from "../constants";
import {
  createAdminUser,
  deleteAdminCourse,
  deleteFeedbackItem,
  deleteFinanceEntry,
  deleteAdminBlog,
  deleteAdminCategory,
  deleteAdminTag,
  getAdminCourses,
  getAdminBlogs,
  getAdminCategories,
  getAdminTags,
  getAdminUsers,
  getCurrentAdmin,
  getFeedbackItems,
  getFeedbackSummary,
  getFinanceEntries,
  getFinanceSummary,
  getStudentPlatformSettings,
  importCampusInfoDrafts,
  isAdminImageUploadConfigured,
  loginAdmin,
  saveAdminCourse,
  saveAdminBlog,
  saveAdminCategory,
  saveFinanceEntry,
  saveAdminTag,
  updateFeedbackItem,
  updateAdminUser,
  updateAdminUserStatus,
  updateAdminUserVerification,
  updateStudentPlatformSettings,
  uploadAdminImage,
} from "../services/adminApi";
import {
  buildBlogPayload,
  buildCategoryPayload,
  buildCoursePayload,
  buildFinancePayload,
  buildImportPayload,
  buildSlug,
  buildTeamPayload,
  buildTagPayload,
  createEmptyCollectionState,
  formatDateTimeLocal,
  formatEditorContent,
  getBlogTagIds,
  sortByLatest,
} from "../utils/adminHelpers";

function getErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      fallbackMessage
    );
  }

  return error instanceof Error ? error.message : fallbackMessage;
}

export function useAdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [currentView, setCurrentView] = useState(ADMIN_VIEWS.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loginData, setLoginData] = useState(EMPTY_LOGIN_FORM);
  const [blogForm, setBlogForm] = useState(EMPTY_BLOG_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [tagForm, setTagForm] = useState(EMPTY_TAG_FORM);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_FORM);
  const [financeForm, setFinanceForm] = useState(EMPTY_FINANCE_FORM);
  const [importForm, setImportForm] = useState(EMPTY_IMPORT_FORM);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM);
  const [blogs, setBlogs] = useState(createEmptyCollectionState);
  const [categories, setCategories] = useState(createEmptyCollectionState);
  const [tags, setTags] = useState(createEmptyCollectionState);
  const [teamMembers, setTeamMembers] = useState(createEmptyCollectionState);
  const [financeEntries, setFinanceEntries] = useState(
    createEmptyCollectionState,
  );
  const [financeSummary, setFinanceSummary] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState(
    createEmptyCollectionState,
  );
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [courses, setCourses] = useState(createEmptyCollectionState);
  const [studentPlatformSettings, setStudentPlatformSettings] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [editingFinanceEntry, setEditingFinanceEntry] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [importingDrafts, setImportingDrafts] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canUploadImages = isAdminImageUploadConfigured();
  const isSuperAdmin = currentAdmin?.role === "SUPER_ADMIN";
  const canManageBlogs = isSuperAdmin;

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!storedToken) {
      setBootstrapping(false);
      return;
    }

    const restoreSession = async () => {
      setAuthToken(storedToken);

      try {
        const adminProfile = await getCurrentAdmin(storedToken);
        setCurrentAdmin(adminProfile);
        setIsLoggedIn(true);
        setCurrentView(ADMIN_VIEWS.DASHBOARD);
        await loadDashboardData(storedToken, adminProfile);
      } catch (restoreError) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAuthToken(null);
        setIsLoggedIn(false);
        setCurrentView(ADMIN_VIEWS.LOGIN);
        setError(
          getErrorMessage(
            restoreError,
            "Your session expired. Please log in again.",
          ),
        );
      } finally {
        setBootstrapping(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!blogForm.title || editingBlog) {
      return;
    }

    setBlogForm((previousForm) => ({
      ...previousForm,
      slug: buildSlug(previousForm.title),
    }));
  }, [blogForm.title, editingBlog]);

  useEffect(() => {
    if (!categoryForm.name || editingCategory) {
      return;
    }

    setCategoryForm((previousForm) => ({
      ...previousForm,
      slug: buildSlug(previousForm.name),
    }));
  }, [categoryForm.name, editingCategory]);

  useEffect(() => {
    if (!tagForm.name || editingTag) {
      return;
    }

    setTagForm((previousForm) => ({
      ...previousForm,
      slug: buildSlug(previousForm.name),
    }));
  }, [tagForm.name, editingTag]);

  useEffect(() => {
    if (!courseForm.title || editingCourse) {
      return;
    }

    setCourseForm((previousForm) => ({
      ...previousForm,
      slug: buildSlug(previousForm.title),
    }));
  }, [courseForm.title, editingCourse]);

  async function loadDashboardData(
    tokenOverride = authToken,
    adminOverride = currentAdmin,
  ) {
    if (!tokenOverride) {
      return;
    }

    setDashboardLoading(true);

    try {
      const adminForPermissions = adminOverride;
      const [
        blogData,
        categoryData,
        tagData,
        feedbackData,
        feedbackStats,
        studentPlatformData,
      ] =
        await Promise.all([
          getAdminBlogs(tokenOverride),
          getAdminCategories(tokenOverride),
          getAdminTags(tokenOverride),
          getFeedbackItems(tokenOverride),
          getFeedbackSummary(tokenOverride),
          getStudentPlatformSettings(tokenOverride),
        ]);

      setBlogs(blogData);
      setCategories(categoryData);
      setTags(tagData);
      setFeedbackItems(feedbackData);
      setFeedbackSummary(feedbackStats);
      setStudentPlatformSettings(studentPlatformData);

      if (adminForPermissions?.role === "SUPER_ADMIN") {
        const [teamData, financeData, summaryData, courseData] =
          await Promise.all([
            getAdminUsers(tokenOverride),
            getFinanceEntries(tokenOverride),
            getFinanceSummary(tokenOverride),
            getAdminCourses(tokenOverride),
          ]);

        setTeamMembers(teamData);
        setFinanceEntries(financeData);
        setFinanceSummary(summaryData);
        setCourses(courseData);
      } else {
        setTeamMembers(createEmptyCollectionState());
        setFinanceEntries(createEmptyCollectionState());
        setFinanceSummary(null);
        setCourses(createEmptyCollectionState());
      }
    } finally {
      setDashboardLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await loginAdmin(loginData);
      const accessToken = data.access_token || data.accessToken;

      if (!accessToken) {
        throw new Error("Login response did not include an access token.");
      }

      const adminProfile = data.admin || (await getCurrentAdmin(accessToken));

      window.localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
      setAuthToken(accessToken);
      setCurrentAdmin(adminProfile);
      setIsLoggedIn(true);
      setCurrentView(ADMIN_VIEWS.DASHBOARD);
      setLoginData(EMPTY_LOGIN_FORM);
      setSuccess("Login successful.");
      await loadDashboardData(accessToken, adminProfile);
    } catch (loginError) {
      setError(
        getErrorMessage(
          loginError,
          "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      setLoading(false);
      setBootstrapping(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthToken(null);
    setCurrentAdmin(null);
    setIsLoggedIn(false);
    setCurrentView(ADMIN_VIEWS.LOGIN);
    setLoginData(EMPTY_LOGIN_FORM);
    setBlogForm(EMPTY_BLOG_FORM);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setTagForm(EMPTY_TAG_FORM);
    setTeamForm(EMPTY_TEAM_FORM);
    setFinanceForm(EMPTY_FINANCE_FORM);
    setImportForm(EMPTY_IMPORT_FORM);
    setCourseForm(EMPTY_COURSE_FORM);
    setBlogs(createEmptyCollectionState());
    setCategories(createEmptyCollectionState());
    setTags(createEmptyCollectionState());
    setTeamMembers(createEmptyCollectionState());
    setFinanceEntries(createEmptyCollectionState());
    setFinanceSummary(null);
    setFeedbackItems(createEmptyCollectionState());
    setFeedbackSummary(null);
    setCourses(createEmptyCollectionState());
    setStudentPlatformSettings(null);
    setEditingBlog(null);
    setEditingCategory(null);
    setEditingTag(null);
    setEditingFinanceEntry(null);
    setEditingCourse(null);
    setError("");
    setSuccess("");
  }

  async function handleSaveBlog(event) {
    event.preventDefault();
    if (!canManageBlogs) {
      setError("Only a super admin can save or publish blogs.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildBlogPayload(blogForm);
      await saveAdminBlog(authToken, payload, editingBlog?.id);

      setSuccess(
        editingBlog
          ? "Blog updated successfully."
          : "Blog created successfully.",
      );
      resetForm();
      setCurrentView(ADMIN_VIEWS.DASHBOARD);
      await loadDashboardData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to save blog."));
    } finally {
      setLoading(false);
    }
  }

  async function handleBlogImageUpload(file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5MB.");
      return;
    }

    setUploadingImage(true);
    setError("");
    setSuccess("");

    try {
      const imageUrl = await uploadAdminImage(authToken, file);

      setBlogForm((previousForm) => ({
        ...previousForm,
        featuredImage: imageUrl,
      }));
      setSuccess("Image uploaded successfully.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Failed to upload image."));
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleFinanceReceiptUpload(file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image receipt.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose a receipt image smaller than 5MB.");
      return;
    }

    setUploadingReceipt(true);
    setError("");
    setSuccess("");

    try {
      const receiptUrl = await uploadAdminImage(authToken, file);
      setFinanceForm((previousForm) => ({
        ...previousForm,
        receiptUrl,
        receiptFileName: file.name,
      }));
      setSuccess("Receipt uploaded successfully.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Failed to upload receipt."));
    } finally {
      setUploadingReceipt(false);
    }
  }

  async function handleDeleteBlog(blogId) {
    if (!canManageBlogs) {
      setError("Only a super admin can delete blogs.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminBlog(authToken, blogId);
      setSuccess("Blog deleted successfully.");
      await loadDashboardData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Failed to delete blog."));
    }
  }

  function handleEditBlog(blog) {
    if (!canManageBlogs) {
      setError("Only a super admin can edit or publish blogs.");
      return;
    }

    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || "",
      slug: blog.slug || "",
      featuredImage: blog.featuredImage || "",
      content: formatEditorContent(blog.content),
      excerpt: blog.excerpt || "",
      categoryId: blog.categoryId ? String(blog.categoryId) : "",
      status: blog.status || "DRAFT",
      publishedAt: formatDateTimeLocal(blog.publishedAt),
      tags: getBlogTagIds(blog),
    });
    setCurrentView(ADMIN_VIEWS.EDITOR);
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setBlogForm(EMPTY_BLOG_FORM);
    setEditingBlog(null);
  }

  function openCreateView() {
    if (!canManageBlogs) {
      setError("Only a super admin can create or publish blogs.");
      return;
    }

    resetForm();
    setCurrentView(ADMIN_VIEWS.EDITOR);
  }

  async function handleSaveCategory(event) {
    event.preventDefault();
    if (!isSuperAdmin) {
      setError("Only a super admin can manage categories.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildCategoryPayload(categoryForm);
      await saveAdminCategory(authToken, payload, editingCategory?.id);
      setSuccess(
        editingCategory
          ? "Category updated successfully."
          : "Category created successfully.",
      );
      resetCategoryForm();
      setCurrentView(ADMIN_VIEWS.CATEGORIES);
      await loadDashboardData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to save category."));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(categoryId) {
    if (!isSuperAdmin) {
      setError("Only a super admin can delete categories.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminCategory(authToken, categoryId);

      if (editingCategory?.id === categoryId) {
        resetCategoryForm();
      }

      setSuccess("Category deleted successfully.");
      await loadDashboardData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Failed to delete category."));
    }
  }

  function handleEditCategory(category) {
    if (!isSuperAdmin) {
      setError("Only a super admin can edit categories.");
      return;
    }

    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
    });
    setCurrentView(ADMIN_VIEWS.CATEGORIES);
    setError("");
    setSuccess("");
  }

  function resetCategoryForm() {
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setEditingCategory(null);
  }

  async function handleSaveTag(event) {
    event.preventDefault();
    if (!isSuperAdmin) {
      setError("Only a super admin can manage tags.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildTagPayload(tagForm);
      await saveAdminTag(authToken, payload, editingTag?.id);
      setSuccess(
        editingTag ? "Tag updated successfully." : "Tag created successfully.",
      );
      resetTagForm();
      setCurrentView(ADMIN_VIEWS.TAGS);
      await loadDashboardData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to save tag."));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTag(tagId) {
    if (!isSuperAdmin) {
      setError("Only a super admin can delete tags.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminTag(authToken, tagId);

      if (editingTag?.id === tagId) {
        resetTagForm();
      }

      setSuccess("Tag deleted successfully.");
      await loadDashboardData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Failed to delete tag."));
    }
  }

  function handleEditTag(tag) {
    if (!isSuperAdmin) {
      setError("Only a super admin can edit tags.");
      return;
    }

    setEditingTag(tag);
    setTagForm({
      name: tag.name || "",
      slug: tag.slug || "",
    });
    setCurrentView(ADMIN_VIEWS.TAGS);
    setError("");
    setSuccess("");
  }

  function resetTagForm() {
    setTagForm(EMPTY_TAG_FORM);
    setEditingTag(null);
  }

  async function handleCreateTeamMember(event) {
    event.preventDefault();

    if (!isSuperAdmin) {
      setError("Only a super admin can create team members.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createAdminUser(authToken, buildTeamPayload(teamForm));
      setTeamForm(EMPTY_TEAM_FORM);
      setSuccess(
        "Team member created. Approve the account before they can publish blogs.",
      );
      await loadDashboardData();
    } catch (teamError) {
      setError(getErrorMessage(teamError, "Failed to create team member."));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTeamRole(adminId, role) {
    if (!isSuperAdmin) {
      setError("Only a super admin can update team roles.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateAdminUser(authToken, adminId, { role });
      setSuccess("Team role updated.");
      await loadDashboardData();
    } catch (teamError) {
      setError(getErrorMessage(teamError, "Failed to update role."));
    }
  }

  async function handleToggleTeamApproval(adminId, isVerified) {
    if (!isSuperAdmin) {
      setError("Only a super admin can approve team members.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateAdminUserVerification(authToken, adminId, isVerified);
      setSuccess(
        isVerified
          ? "Team member approved for blogging."
          : "Blog approval removed.",
      );
      await loadDashboardData();
    } catch (teamError) {
      setError(getErrorMessage(teamError, "Failed to update approval."));
    }
  }

  async function handleToggleTeamStatus(adminId, isActive) {
    if (!isSuperAdmin) {
      setError("Only a super admin can update account status.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateAdminUserStatus(authToken, adminId, isActive);
      setSuccess(
        isActive ? "Team member activated." : "Team member deactivated.",
      );
      await loadDashboardData();
    } catch (teamError) {
      setError(getErrorMessage(teamError, "Failed to update account status."));
    }
  }

  async function handleSaveFinanceEntry(event) {
    event.preventDefault();

    if (!isSuperAdmin) {
      setError("Only a super admin can manage finances.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await saveFinanceEntry(
        authToken,
        buildFinancePayload(financeForm),
        editingFinanceEntry?.id,
      );
      setFinanceForm(EMPTY_FINANCE_FORM);
      setEditingFinanceEntry(null);
      setSuccess(
        editingFinanceEntry ? "Finance entry updated." : "Finance entry saved.",
      );
      await loadDashboardData();
    } catch (financeError) {
      setError(getErrorMessage(financeError, "Failed to save finance entry."));
    } finally {
      setLoading(false);
    }
  }

  function handleEditFinanceEntry(entry) {
    setEditingFinanceEntry(entry);
    setFinanceForm({
      title: entry.title || "",
      description: entry.description || "",
      type: entry.type || "INCOME",
      group: entry.group || "REVENUE",
      amount: entry.amount ? String(entry.amount) : "",
      category: entry.category || "",
      startupName: entry.startupName || "",
      counterparty: entry.counterparty || "",
      reference: entry.reference || "",
      receiptUrl: entry.receiptUrl || "",
      receiptFileName: entry.receiptFileName || "",
      status: entry.status || "CONFIRMED",
      occurredAt: formatDateTimeLocal(entry.occurredAt),
    });
    setCurrentView(ADMIN_VIEWS.FINANCES);
  }

  async function handleDeleteFinanceEntry(entryId) {
    if (!isSuperAdmin) {
      setError("Only a super admin can delete finance entries.");
      return;
    }

    if (!window.confirm("Delete this finance entry?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteFinanceEntry(authToken, entryId);
      setSuccess("Finance entry deleted.");
      await loadDashboardData();
    } catch (financeError) {
      setError(
        getErrorMessage(financeError, "Failed to delete finance entry."),
      );
    }
  }

  function resetFinanceForm() {
    setFinanceForm(EMPTY_FINANCE_FORM);
    setEditingFinanceEntry(null);
  }

  async function handleImportCampusInfo(event) {
    event.preventDefault();

    if (!isSuperAdmin) {
      setError("Only a super admin can import external drafts.");
      return;
    }

    setImportingDrafts(true);
    setError("");
    setSuccess("");

    try {
      const result = await importCampusInfoDrafts(
        authToken,
        buildImportPayload(importForm),
      );
      setSuccess(
        `${result.sourceName || "Source"} import complete: ${result.imported || 0} draft(s), ${result.skipped || 0} skipped, ${result.failed || 0} failed.`,
      );
      await loadDashboardData();
    } catch (importError) {
      setError(
        getErrorMessage(importError, "Failed to import external drafts."),
      );
    } finally {
      setImportingDrafts(false);
    }
  }

  async function handleUpdateFeedback(feedbackId, payload) {
    setError("");
    setSuccess("");

    try {
      await updateFeedbackItem(authToken, feedbackId, payload);
      setSuccess("Feedback updated.");
      await loadDashboardData();
    } catch (feedbackError) {
      setError(getErrorMessage(feedbackError, "Failed to update feedback."));
    }
  }

  async function handleDeleteFeedback(feedbackId) {
    if (!window.confirm("Delete this feedback item?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteFeedbackItem(authToken, feedbackId);
      setSuccess("Feedback deleted.");
      await loadDashboardData();
    } catch (feedbackError) {
      setError(getErrorMessage(feedbackError, "Failed to delete feedback."));
    }
  }

  async function handleSaveCourse(event) {
    event.preventDefault();

    if (!isSuperAdmin) {
      setError("Only a super admin can manage courses.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await saveAdminCourse(
        authToken,
        buildCoursePayload(courseForm),
        editingCourse?.id,
      );
      resetCourseForm();
      setSuccess(editingCourse ? "Course updated." : "Course saved.");
      await loadDashboardData();
    } catch (courseError) {
      setError(getErrorMessage(courseError, "Failed to save course."));
    } finally {
      setLoading(false);
    }
  }

  function handleEditCourse(course) {
    if (!isSuperAdmin) {
      setError("Only a super admin can edit courses.");
      return;
    }

    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      slug: course.slug || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price ? String(course.price) : "",
      currency: course.currency || "NGN",
      level: course.level || "BEGINNER",
      duration: course.duration || "",
      thumbnailUrl: course.thumbnailUrl || "",
      outcomes: Array.isArray(course.outcomes)
        ? course.outcomes.join("\n")
        : "",
      status: course.status || "DRAFT",
      publishedAt: formatDateTimeLocal(course.publishedAt),
    });
    setCurrentView(ADMIN_VIEWS.COURSES);
    setError("");
    setSuccess("");
  }

  async function handleDeleteCourse(courseId) {
    if (!isSuperAdmin) {
      setError("Only a super admin can delete courses.");
      return;
    }

    if (!window.confirm("Delete this course?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminCourse(authToken, courseId);
      setSuccess("Course deleted.");
      await loadDashboardData();
    } catch (courseError) {
      setError(getErrorMessage(courseError, "Failed to delete course."));
    }
  }

  function resetCourseForm() {
    setCourseForm(EMPTY_COURSE_FORM);
    setEditingCourse(null);
  }

  async function handleToggleStudentPlatform(isEnabled) {
    if (!isSuperAdmin) {
      setError("Only a super admin can open or close the Student OS.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updatedSettings = await updateStudentPlatformSettings(authToken, {
        isEnabled,
      });
      setStudentPlatformSettings(updatedSettings);
      setSuccess(
        isEnabled
          ? "Student OS is now open to public users."
          : "Student OS is now closed to public users.",
      );
    } catch (studentPlatformError) {
      setError(
        getErrorMessage(
          studentPlatformError,
          "Failed to update Student OS launch status.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  const blogItems = useMemo(() => sortByLatest(blogs.items), [blogs.items]);
  const latestPublishedBlog = useMemo(
    () => blogItems.find((blog) => blog.status === "PUBLISHED") || null,
    [blogItems],
  );

  const stats = useMemo(
    () => [
      {
        id: "total",
        label: "Total Blogs",
        value: blogs.total || blogItems.length,
        tone: "cyan",
      },
      {
        id: "published",
        label: "Published",
        value: blogItems.filter((blog) => blog.status === "PUBLISHED").length,
        tone: "green",
      },
      {
        id: "drafts",
        label: "Drafts",
        value: blogItems.filter((blog) => blog.status === "DRAFT").length,
        tone: "amber",
      },
      {
        id: "categories",
        label: "Categories",
        value: categories.total || categories.items.length,
        tone: "slate",
      },
      {
        id: "tags",
        label: "Tags",
        value: tags.total || tags.items.length,
        tone: "violet",
      },
    ],
    [blogItems, blogs.total, categories.total, categories.items.length, tags],
  );

  return {
    isLoggedIn,
    authToken,
    currentAdmin,
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
    canUploadImages,
    setCurrentView,
    setShowPassword,
    setLoginData,
    setBlogForm,
    setCategoryForm,
    setTagForm,
    setTeamForm,
    setFinanceForm,
    setImportForm,
    setCourseForm,
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
    refreshDashboard: loadDashboardData,
  };
}
