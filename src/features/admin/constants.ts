export const ADMIN_TOKEN_KEY = "adminToken";
export const ADMIN_COLLECTION_LIMIT = 20;

export const ADMIN_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "EDITOR", label: "Editor" },
  { value: "AUTHOR", label: "Author" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
];

export const BLOG_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export const BLOG_STATUS_FILTERS = [
  { value: "ALL", label: "All Posts" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
  { value: "ARCHIVED", label: "Archived" },
];

export const ADMIN_VIEWS = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  EDITOR: "editor",
  CATEGORIES: "categories",
  TAGS: "tags",
  TEAM: "team",
  FINANCES: "finances",
  IMPORTER: "importer",
  FEEDBACK: "feedback",
  COURSES: "courses",
  STUDENT_PLATFORM: "student-platform",
};

export const EMPTY_LOGIN_FORM = {
  email: "",
  password: "",
};

export const EMPTY_BLOG_FORM = {
  title: "",
  slug: "",
  featuredImage: "",
  content: "",
  excerpt: "",
  categoryId: "",
  status: "DRAFT",
  publishedAt: "",
  tags: [],
};

export const EMPTY_TEAM_FORM = {
  name: "",
  displayName: "",
  email: "",
  password: "",
  shortBio: "",
  role: "EDITOR",
  profilePicture: "",
};

export const FINANCE_ENTRY_TYPES = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

export const FINANCE_ENTRY_GROUPS = [
  { value: "REVENUE", label: "Revenue" },
  { value: "SAVINGS", label: "Savings" },
  { value: "LOANS", label: "Loans" },
  { value: "PARTNERSHIP_DEALS", label: "Partnership deals" },
  { value: "STOCKS", label: "Stocks" },
  { value: "REAL_ESTATE", label: "Real estate" },
  { value: "DIVIDENDS", label: "Dividends" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "TAX", label: "Tax" },
  { value: "PAYROLL", label: "Payroll" },
  { value: "OTHER", label: "Other" },
];

export const FINANCE_ENTRY_STATUSES = [
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const EMPTY_FINANCE_FORM = {
  title: "",
  description: "",
  type: "INCOME",
  group: "REVENUE",
  amount: "",
  category: "",
  startupName: "",
  counterparty: "",
  reference: "",
  receiptUrl: "",
  receiptFileName: "",
  status: "CONFIRMED",
  occurredAt: "",
};

export const EMPTY_IMPORT_FORM = {
  limit: 10,
  sourceKey: "SCHOLARSHIP_REGION",
  categoryId: "",
  sourceUrl: "",
};

export const IMPORT_SOURCES = [
  {
    value: "SCHOLARSHIP_REGION",
    label: "Scholarship Region",
    url: "https://www.scholarshipregion.com/",
  },
  {
    value: "OPPORTUNITIES_FOR_AFRICANS",
    label: "Opportunities for Africans",
    url: "https://www.opportunitiesforafricans.com/",
  },
  {
    value: "TECHCABAL",
    label: "TechCabal",
    url: "https://techcabal.com/",
  },
  {
    value: "CAMPUSINFO",
    label: "CampusInfo",
    url: "https://www.campusinfo.com.ng/",
  },
  {
    value: "CUSTOM",
    label: "Custom source",
    url: "",
  },
];

export const FEEDBACK_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DECLINED", label: "Declined" },
];

export const FEEDBACK_PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export const COURSE_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export const COURSE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "ALL_LEVELS", label: "All levels" },
];

export const EMPTY_COURSE_FORM = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  currency: "NGN",
  level: "BEGINNER",
  duration: "",
  thumbnailUrl: "",
  outcomes: "",
  status: "DRAFT",
  publishedAt: "",
};

export const EMPTY_CATEGORY_FORM = {
  name: "",
  slug: "",
  description: "",
};

export const EMPTY_TAG_FORM = {
  name: "",
  slug: "",
};

export const EMPTY_COLLECTION = {
  items: [],
  total: 0,
  page: 1,
  limit: 0,
};
