import { EMPTY_COLLECTION } from "../constants";
import {
  formatEditorContent,
  normalizeContentInput,
} from "@/shared/utils/blogContent";

export { formatEditorContent, normalizeContentInput };

export function buildSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createEmptyCollectionState() {
  return {
    ...EMPTY_COLLECTION,
    items: [],
  };
}

export function normalizeAdminCollection(data) {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  }

  const collectionCandidates = [
    data?.items,
    data?.data,
    data?.results,
    data?.blogs,
    data?.categories,
    data?.tags,
    data?.feedback,
    data?.courses,
  ];

  for (const candidate of collectionCandidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    return {
      items: candidate,
      total: Number(data?.total ?? candidate.length) || candidate.length,
      page: Number(data?.page ?? 1) || 1,
      limit: Number(data?.limit ?? candidate.length) || candidate.length,
    };
  }

  return createEmptyCollectionState();
}

export function getBlogTagIds(blog) {
  if (Array.isArray(blog?.tagIds)) {
    return blog.tagIds.map((tagId) => String(tagId));
  }

  if (Array.isArray(blog?.tags)) {
    return blog.tags
      .map((tag) => tag?.id)
      .filter(Boolean)
      .map((tagId) => String(tagId));
  }

  return [];
}

export function buildBlogPayload(blogForm) {
  const excerpt = blogForm.excerpt.trim();
  const publishedAt = blogForm.publishedAt
    ? new Date(blogForm.publishedAt).toISOString()
    : undefined;

  return {
    title: blogForm.title.trim(),
    slug: buildSlug(blogForm.slug || blogForm.title),
    featuredImage: blogForm.featuredImage.trim(),
    content: normalizeContentInput(blogForm.content),
    excerpt: excerpt || undefined,
    categoryId: String(blogForm.categoryId).trim(),
    status: blogForm.status,
    publishedAt,
    tagIds: blogForm.tags.map((tagId) => String(tagId)),
  };
}

export function buildTeamPayload(teamForm) {
  const payload = {
    name: teamForm.name.trim(),
    displayName: teamForm.displayName.trim(),
    email: teamForm.email.trim(),
    password: teamForm.password,
    shortBio: teamForm.shortBio.trim() || undefined,
    role: teamForm.role,
    profilePicture: teamForm.profilePicture.trim() || undefined,
  };

  return payload;
}

export function buildFinancePayload(financeForm) {
  const occurredAt = financeForm.occurredAt
    ? new Date(financeForm.occurredAt).toISOString()
    : undefined;

  return {
    title: financeForm.title.trim(),
    description: financeForm.description.trim() || undefined,
    type: financeForm.type,
    group: financeForm.group,
    amount: Number(financeForm.amount),
    category: financeForm.category.trim() || undefined,
    startupName: financeForm.startupName.trim() || undefined,
    counterparty: financeForm.counterparty.trim() || undefined,
    reference: financeForm.reference.trim() || undefined,
    receiptUrl: financeForm.receiptUrl.trim() || undefined,
    receiptFileName: financeForm.receiptFileName.trim() || undefined,
    status: financeForm.status,
    occurredAt,
  };
}

export function buildImportPayload(importForm) {
  return {
    limit: Number(importForm.limit) || 10,
    sourceKey: importForm.sourceKey || "SCHOLARSHIP_REGION",
    categoryId: importForm.categoryId || undefined,
    sourceUrl: importForm.sourceUrl.trim() || undefined,
  };
}

export function buildCoursePayload(courseForm) {
  const publishedAt = courseForm.publishedAt
    ? new Date(courseForm.publishedAt).toISOString()
    : undefined;
  const outcomes = courseForm.outcomes
    .split("\n")
    .map((outcome) => outcome.trim())
    .filter(Boolean);

  return {
    title: courseForm.title.trim(),
    slug: buildSlug(courseForm.slug || courseForm.title),
    shortDescription: courseForm.shortDescription.trim(),
    description: courseForm.description.trim(),
    price: Number(courseForm.price),
    currency: courseForm.currency.trim() || "NGN",
    level: courseForm.level,
    duration: courseForm.duration.trim(),
    thumbnailUrl: courseForm.thumbnailUrl.trim() || undefined,
    outcomes,
    status: courseForm.status,
    publishedAt,
  };
}

export function buildCategoryPayload(categoryForm) {
  const description = categoryForm.description.trim();

  return {
    name: categoryForm.name.trim(),
    slug: buildSlug(categoryForm.slug || categoryForm.name),
    description: description || undefined,
  };
}

export function buildTagPayload(tagForm) {
  return {
    name: tagForm.name.trim(),
    slug: buildSlug(tagForm.slug || tagForm.name),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchesAllowedIp(ipAddress, allowedPatterns) {
  if (!ipAddress) {
    return false;
  }

  return allowedPatterns.some((pattern) => {
    const normalizedPattern = pattern.trim();

    if (!normalizedPattern) {
      return false;
    }

    if (!normalizedPattern.includes("*")) {
      return normalizedPattern === ipAddress;
    }

    const expression = new RegExp(
      `^${escapeRegExp(normalizedPattern).replace(/\\\*/g, ".*")}$`,
    );

    return expression.test(ipAddress);
  });
}

export function parseAllowedIpList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function formatCurrency(value) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function sortByLatest(items, primaryField = "updatedAt") {
  return [...items].sort((firstItem, secondItem) => {
    const firstValue = new Date(
      firstItem?.[primaryField] || firstItem?.createdAt || 0,
    ).getTime();
    const secondValue = new Date(
      secondItem?.[primaryField] || secondItem?.createdAt || 0,
    ).getTime();

    return secondValue - firstValue;
  });
}

export function resolveCategoryName(blog, categoryMap) {
  return (
    blog?.category?.name ||
    categoryMap.get(String(blog?.categoryId || "")) ||
    "Uncategorized"
  );
}

export function countBlogsForCategory(blogs, categoryId) {
  return blogs.filter((blog) => String(blog.categoryId) === String(categoryId))
    .length;
}

export function countPublishedBlogsForCategory(blogs, categoryId) {
  return blogs.filter(
    (blog) =>
      String(blog.categoryId) === String(categoryId) &&
      blog.status === "PUBLISHED",
  ).length;
}

export function countBlogsForTag(blogs, tagId) {
  return blogs.filter((blog) => getBlogTagIds(blog).includes(String(tagId)))
    .length;
}

export function countPublishedBlogsForTag(blogs, tagId) {
  return blogs.filter(
    (blog) =>
      blog.status === "PUBLISHED" &&
      getBlogTagIds(blog).includes(String(tagId)),
  ).length;
}
