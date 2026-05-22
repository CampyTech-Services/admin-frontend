import { apiClient } from "@/shared/utils/client";
import { ADMIN_COLLECTION_LIMIT } from "../constants";
import { normalizeAdminCollection } from "../utils/adminHelpers";

const defaultCollectionParams = {
  page: 1,
  limit: ADMIN_COLLECTION_LIMIT,
};

function withToken(token, config: any = {}) {
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function loginAdmin(credentials) {
  const response = await apiClient.post("/auth/admin/login", credentials);
  return response.data;
}

export async function getCurrentAdmin(token) {
  const response = await apiClient.get("/admin/me", withToken(token));
  return response.data;
}

export async function getAdminUsers(token) {
  const response = await apiClient.get(
    "/admin",
    withToken(token, { params: defaultCollectionParams }),
  );
  return normalizeAdminCollection(response.data);
}

export async function createAdminUser(token, payload) {
  const response = await apiClient.post("/admin", payload, withToken(token));
  return response.data;
}

export async function updateAdminUser(token, adminId, payload) {
  const response = await apiClient.put(
    `/admin/${adminId}`,
    payload,
    withToken(token),
  );
  return response.data;
}

export async function updateAdminUserStatus(token, adminId, isActive) {
  const response = await apiClient.put(
    `/admin/${adminId}/status`,
    { isActive },
    withToken(token),
  );
  return response.data;
}

export async function updateAdminUserVerification(token, adminId, isVerified) {
  const response = await apiClient.put(
    `/admin/${adminId}/verify`,
    { isVerified },
    withToken(token),
  );
  return response.data;
}

export async function getAdminBlogs(token) {
  const response = await apiClient.get(
    "/admin/blog/all",
    withToken(token, { params: defaultCollectionParams }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getAdminCategories(token) {
  const response = await apiClient.get(
    "/admin/category/all",
    withToken(token, { params: defaultCollectionParams }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getAdminTags(token) {
  const response = await apiClient.get(
    "/admin/tag/all",
    withToken(token, { params: defaultCollectionParams }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getFinanceEntries(token) {
  const response = await apiClient.get(
    "/admin/finance",
    withToken(token, { params: { page: 1, limit: ADMIN_COLLECTION_LIMIT } }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getFinanceSummary(token) {
  const response = await apiClient.get(
    "/admin/finance/summary",
    withToken(token),
  );
  return response.data;
}

export async function getFeedbackItems(token) {
  const response = await apiClient.get(
    "/admin/feedback",
    withToken(token, { params: { page: 1, limit: ADMIN_COLLECTION_LIMIT } }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getFeedbackSummary(token) {
  const response = await apiClient.get(
    "/admin/feedback/summary",
    withToken(token),
  );
  return response.data;
}

export async function updateFeedbackItem(token, feedbackId, payload) {
  const response = await apiClient.put(
    `/admin/feedback/${feedbackId}`,
    payload,
    withToken(token),
  );
  return response.data;
}

export async function deleteFeedbackItem(token, feedbackId) {
  const response = await apiClient.delete(
    `/admin/feedback/${feedbackId}`,
    withToken(token),
  );
  return response.data;
}

export async function getAdminCourses(token) {
  const response = await apiClient.get(
    "/admin/courses",
    withToken(token, { params: { page: 1, limit: ADMIN_COLLECTION_LIMIT } }),
  );
  return normalizeAdminCollection(response.data);
}

export async function getStudentPlatformSettings(token) {
  const response = await apiClient.get(
    "/admin/student-platform",
    withToken(token),
  );
  return response.data;
}

export async function updateStudentPlatformSettings(token, payload) {
  const response = await apiClient.put(
    "/admin/student-platform",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function saveAdminCourse(token, payload, courseId) {
  if (courseId) {
    const response = await apiClient.put(
      `/admin/courses/${courseId}`,
      payload,
      withToken(token),
    );
    return response.data;
  }

  const response = await apiClient.post(
    "/admin/courses",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function deleteAdminCourse(token, courseId) {
  const response = await apiClient.delete(
    `/admin/courses/${courseId}`,
    withToken(token),
  );
  return response.data;
}

export async function saveFinanceEntry(token, payload, financeEntryId) {
  if (financeEntryId) {
    const response = await apiClient.put(
      `/admin/finance/${financeEntryId}`,
      payload,
      withToken(token),
    );
    return response.data;
  }

  const response = await apiClient.post(
    "/admin/finance",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function deleteFinanceEntry(token, financeEntryId) {
  const response = await apiClient.delete(
    `/admin/finance/${financeEntryId}`,
    withToken(token),
  );
  return response.data;
}

export async function importCampusInfoDrafts(token, payload) {
  const response = await apiClient.post(
    "/admin/import/drafts",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function saveAdminBlog(token, payload, blogId) {
  if (blogId) {
    const response = await apiClient.put(
      `/admin/blog/${blogId}`,
      payload,
      withToken(token),
    );

    return response.data;
  }

  const response = await apiClient.post(
    "/admin/blog",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function deleteAdminBlog(token, blogId) {
  const response = await apiClient.delete(
    `/admin/blog/${blogId}`,
    withToken(token),
  );

  return response.data;
}

export async function saveAdminCategory(token, payload, categoryId) {
  if (categoryId) {
    const response = await apiClient.put(
      `/admin/category/${categoryId}`,
      payload,
      withToken(token),
    );

    return response.data;
  }

  const response = await apiClient.post(
    "/admin/category",
    payload,
    withToken(token),
  );

  return response.data;
}

export async function deleteAdminCategory(token, categoryId) {
  const response = await apiClient.delete(
    `/admin/category/${categoryId}`,
    withToken(token),
  );

  return response.data;
}

export async function saveAdminTag(token, payload, tagId) {
  if (tagId) {
    const response = await apiClient.put(
      `/admin/tag/${tagId}`,
      payload,
      withToken(token),
    );

    return response.data;
  }

  const response = await apiClient.post(
    "/admin/tag",
    payload,
    withToken(token),
  );
  return response.data;
}

export async function deleteAdminTag(token, tagId) {
  const response = await apiClient.delete(
    `/admin/tag/${tagId}`,
    withToken(token),
  );

  return response.data;
}

export function isAdminImageUploadConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_IMGBB_API_KEY);
}

export async function uploadAdminImage(token, file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Image uploads are not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to enable direct uploads.",
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  // Use this sample image or upload your own via the Media Library
  const response = await apiClient.post(`/admin/upload/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...withToken(token),
  });
  const imageUrl =
    response.data?.data?.url || response.data?.data?.display_url || "";

  if (!imageUrl) {
    throw new Error("Image upload completed, but no public URL was returned.");
  }

  return imageUrl;
}
