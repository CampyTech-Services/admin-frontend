import { useDeferredValue, useRef, useState } from "react";
import {
  Archive,
  Bold,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Heading2,
  Heading3,
  Image,
  Italic,
  LoaderCircle,
  Link2,
  List,
  ListOrdered,
  Quote,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { BlogArticleContent } from "@/features/home/ui/BlogArticleContent";
import { normalizeContentBlocks } from "@/shared/utils/blogContent";
import { BLOG_STATUSES } from "../constants";

const statusTone = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-slate-200 text-slate-700",
};

const statusIcon = {
  DRAFT: CalendarDays,
  PUBLISHED: CheckCircle2,
  ARCHIVED: Archive,
};

const EDITOR_PLACEHOLDER = `Start writing your story here...

## Section heading

Write paragraphs normally. Use **bold**, _italic_, and [links](https://example.com).

- Add bullet points
- Keep related ideas together

1. Create numbered steps
2. Show a process clearly

> Highlight an important quote
> -- Add the source`;

function FormattingButton({ icon: Icon, label, onPress }) {
  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 sm:text-sm"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function CategoryField({ categories, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        Category
      </span>
      <div className="relative">
        <FolderOpen className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-11 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories?.items?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function StatusField({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        Status
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
      >
        {BLOG_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PublishedAtField({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        Display Date and Time
      </span>
      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="datetime-local"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-11 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
        />
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-500">
        Leave empty to use the backend publish time, or pick a past date for
        older stories.
      </p>
    </label>
  );
}

function StatusIndicator({ status }) {
  const StatusIcon = statusIcon[status];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Current Status
      </p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
        <StatusIcon className="h-4 w-4" />
        <span className={`rounded-full px-2 py-1 text-xs ${statusTone[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function wrapSelectedText(value, selectionStart, selectionEnd, prefix, suffix, placeholder) {
  const selectedText = value.slice(selectionStart, selectionEnd);
  const nextText = selectedText || placeholder;
  const nextValue = `${value.slice(0, selectionStart)}${prefix}${nextText}${suffix}${value.slice(selectionEnd)}`;
  const nextSelectionStart = selectionStart + prefix.length;
  const nextSelectionEnd = nextSelectionStart + nextText.length;

  return {
    value: nextValue,
    selectionStart: nextSelectionStart,
    selectionEnd: nextSelectionEnd,
  };
}

function insertBlockTemplate(value, selectionStart, selectionEnd, template, selectedText) {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const leadingBreak = before
    ? before.endsWith("\n\n")
      ? ""
      : before.endsWith("\n")
        ? "\n"
        : "\n\n"
    : "";
  const trailingBreak = after
    ? after.startsWith("\n\n")
      ? ""
      : after.startsWith("\n")
        ? "\n"
        : "\n\n"
    : "";
  const nextValue = `${before}${leadingBreak}${template}${trailingBreak}${after}`;
  const templateStart = before.length + leadingBreak.length;
  const selectionOffset = selectedText ? template.indexOf(selectedText) : template.length;
  const nextSelectionStart =
    selectionOffset >= 0 ? templateStart + selectionOffset : templateStart + template.length;
  const nextSelectionEnd = selectedText
    ? nextSelectionStart + selectedText.length
    : nextSelectionStart;

  return {
    value: nextValue,
    selectionStart: nextSelectionStart,
    selectionEnd: nextSelectionEnd,
  };
}

function insertLink(value, selectionStart, selectionEnd) {
  const selectedText = value.slice(selectionStart, selectionEnd);
  const label = selectedText || "link text";
  const url = "https://example.com";
  const linkText = `[${label}](${url})`;
  const nextValue = `${value.slice(0, selectionStart)}${linkText}${value.slice(selectionEnd)}`;
  const nextSelectionStart = selectedText
    ? selectionStart + label.length + 3
    : selectionStart + 1;
  const nextSelectionEnd = selectedText
    ? nextSelectionStart + url.length
    : nextSelectionStart + label.length;

  return {
    value: nextValue,
    selectionStart: nextSelectionStart,
    selectionEnd: nextSelectionEnd,
  };
}

export function BlogEditor({
  blogForm,
  categories,
  tags,
  editingBlog,
  loading,
  uploadingImage,
  canUploadImages,
  onFieldChange,
  onImageUpload,
  onSubmit,
  onCancel,
}) {
  const contentInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [mobileContentView, setMobileContentView] = useState("editor");
  const deferredContent = useDeferredValue(blogForm.content);
  const previewBlocks = normalizeContentBlocks(deferredContent);
  const selectedCategory = categories?.items?.find(
    (category) => String(category.id) === String(blogForm.categoryId),
  );
  const submitLabel = loading
    ? "Saving..."
    : editingBlog
      ? "Update Blog"
      : "Create Blog";

  function updateContentField(nextValue, selectionStart, selectionEnd) {
    onFieldChange("content", nextValue);

    if (
      typeof selectionStart !== "number" ||
      typeof selectionEnd !== "number" ||
      typeof window === "undefined"
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      const textarea = contentInputRef.current;

      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  function getSelectionRange() {
    const textarea = contentInputRef.current;

    if (!textarea) {
      const cursorPosition = blogForm.content.length;

      return {
        selectionStart: cursorPosition,
        selectionEnd: cursorPosition,
      };
    }

    return {
      selectionStart: textarea.selectionStart ?? 0,
      selectionEnd: textarea.selectionEnd ?? 0,
    };
  }

  function applyInlineFormat(prefix, suffix, placeholder) {
    const { selectionStart, selectionEnd } = getSelectionRange();
    const nextState = wrapSelectedText(
      blogForm.content,
      selectionStart,
      selectionEnd,
      prefix,
      suffix,
      placeholder,
    );

    updateContentField(
      nextState.value,
      nextState.selectionStart,
      nextState.selectionEnd,
    );
  }

  function applyBlockFormat(template, selectedText) {
    const { selectionStart, selectionEnd } = getSelectionRange();
    const nextState = insertBlockTemplate(
      blogForm.content,
      selectionStart,
      selectionEnd,
      template,
      selectedText,
    );

    updateContentField(
      nextState.value,
      nextState.selectionStart,
      nextState.selectionEnd,
    );
  }

  function applyLinkFormat() {
    const { selectionStart, selectionEnd } = getSelectionRange();
    const nextState = insertLink(blogForm.content, selectionStart, selectionEnd);

    updateContentField(
      nextState.value,
      nextState.selectionStart,
      nextState.selectionEnd,
    );
  }

  function handleImageSelection(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onImageUpload(selectedFile);
    event.target.value = "";
  }

  return (
    <form
      className="grid gap-6 pb-24 xl:grid-cols-[minmax(0,1.45fr)_23rem] xl:gap-8 xl:pb-0"
      onSubmit={onSubmit}
    >
      <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Fill in the story details below and choose whether to keep it in
            draft, publish it immediately, or archive it.
          </p>
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Blog Title
            </span>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
              placeholder="Enter blog title..."
            />
          </label>

          <div className="grid gap-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Slug
              </span>
              <input
                type="text"
                required
                value={blogForm.slug}
                onChange={(event) => onFieldChange("slug", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
                placeholder="blog-url-slug"
              />
            </label>
          </div>

          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-cyan-600" />
                  <h3 className="text-base font-black text-slate-950">
                    Featured Image
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  Upload from a device and let storage return the URL
                  automatically, or paste a direct image URL yourself.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelection}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={!canUploadImages || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImage ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>
                    {uploadingImage
                      ? "Uploading..."
                      : canUploadImages
                        ? "Upload Image"
                        : "Upload Disabled"}
                  </span>
                </button>

                {blogForm.featuredImage ? (
                  <button
                    type="button"
                    onClick={() => onFieldChange("featuredImage", "")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                {blogForm.featuredImage ? (
                  <img
                    src={blogForm.featuredImage}
                    alt="Featured preview"
                    className="h-56 w-full object-cover sm:h-64"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-[linear-gradient(135deg,_#cffafe_0%,_#dbeafe_45%,_#e2e8f0_100%)] px-6 text-center text-sm font-semibold text-slate-500 sm:h-64">
                    Upload a cover image to make the story stand out across the
                    homepage and the article page.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Image URL
                  </span>
                  <input
                    type="url"
                    required
                    value={blogForm.featuredImage}
                    onChange={(event) =>
                      onFieldChange("featuredImage", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </label>

                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Upload Notes
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {canUploadImages
                      ? "Direct upload is enabled. Pick a file from your phone or laptop and the returned storage URL will fill this field automatically."
                      : "Direct upload is not configured yet. Add NEXT_PUBLIC_IMGBB_API_KEY to enable uploads, or paste an image URL here manually."}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Recommended: JPG, PNG, or WEBP under 5MB.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Excerpt
            </span>
            <textarea
              rows={4}
              value={blogForm.excerpt}
              onChange={(event) => onFieldChange("excerpt", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:text-sm"
              placeholder="A short summary of the blog post..."
            />
          </label>

          <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 xl:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Quick Setup
                </h3>
                <p className="text-xs leading-6 text-slate-500">
                  Set the required publishing options before writing.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 shadow-sm">
                Mobile
              </span>
            </div>

            <div className="mt-4 grid gap-4">
              <CategoryField
                categories={categories}
                value={blogForm.categoryId}
                onChange={(value) => onFieldChange("categoryId", value)}
              />
              <StatusField
                value={blogForm.status}
                onChange={(value) => onFieldChange("status", value)}
              />
              <PublishedAtField
                value={blogForm.publishedAt}
                onChange={(value) => onFieldChange("publishedAt", value)}
              />
              <StatusIndicator status={blogForm.status} />
            </div>
          </section>

          <div className="block">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Content
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Live article preview
              </span>
            </div>

            <div className="mt-4 lg:hidden">
              <div className="inline-flex w-full rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMobileContentView("editor")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mobileContentView === "editor"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setMobileContentView("preview")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mobileContentView === "preview"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            <div
              className={`mt-4 -mx-1 overflow-x-auto pb-1 lg:mx-0 lg:overflow-visible lg:pb-0 ${
                mobileContentView === "preview" ? "hidden lg:block" : ""
              }`}
            >
              <div className="flex w-max gap-2 px-1 lg:w-auto lg:flex-wrap lg:px-0">
                <FormattingButton
                  icon={Bold}
                  label="Bold"
                  onPress={() => applyInlineFormat("**", "**", "bold text")}
                />
                <FormattingButton
                  icon={Italic}
                  label="Italic"
                  onPress={() => applyInlineFormat("_", "_", "highlight")}
                />
                <FormattingButton
                  icon={Link2}
                  label="Link"
                  onPress={applyLinkFormat}
                />
                <FormattingButton
                  icon={Heading2}
                  label="Heading"
                  onPress={() => applyBlockFormat("## Heading", "Heading")}
                />
                <FormattingButton
                  icon={Heading3}
                  label="Subheading"
                  onPress={() =>
                    applyBlockFormat("### Subheading", "Subheading")
                  }
                />
                <FormattingButton
                  icon={List}
                  label="Bullets"
                  onPress={() =>
                    applyBlockFormat("- List item\n- Another point", "List item")
                  }
                />
                <FormattingButton
                  icon={ListOrdered}
                  label="Numbered"
                  onPress={() =>
                    applyBlockFormat("1. First step\n2. Next step", "First step")
                  }
                />
                <FormattingButton
                  icon={Quote}
                  label="Quote"
                  onPress={() =>
                    applyBlockFormat(
                      "> Quote text\n> -- Source",
                      "Quote text",
                    )
                  }
                />
              </div>
            </div>

            <p
              className={`mt-3 text-xs leading-6 text-slate-500 ${
                mobileContentView === "preview" ? "hidden lg:block" : ""
              }`}
            >
              Write naturally, add blank lines between sections, and use the
              toolbar for headings, lists, quotes, bold text, italic text, and
              links. The preview mirrors how the story body will render on the
              public blog page.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div
                className={`rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 ${
                  mobileContentView === "preview" ? "hidden lg:block" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Story Draft
                    </h3>
                    <p className="text-xs leading-6 text-slate-500">
                      Markdown-style writing with formatting shortcuts.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-sm">
                    Editor
                  </span>
                </div>
                <textarea
                  ref={contentInputRef}
                  required
                  rows={18}
                  value={blogForm.content}
                  onChange={(event) => onFieldChange("content", event.target.value)}
                  className="min-h-[20rem] w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:min-h-[24rem] sm:text-sm"
                  placeholder={EDITOR_PLACEHOLDER}
                />
              </div>

              <div
                className={`rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 ${
                  mobileContentView === "editor" ? "hidden lg:block" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Live Preview
                    </h3>
                    <p className="text-xs leading-6 text-slate-500">
                      Updates as the story changes.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 shadow-sm">
                    Preview
                  </span>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                  {blogForm.featuredImage ? (
                    <img
                      src={blogForm.featuredImage}
                      alt="Article preview"
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,_#cffafe_0%,_#dbeafe_45%,_#e2e8f0_100%)] px-6 text-center text-sm font-semibold text-slate-500">
                      Add a featured image URL to see the article cover here.
                    </div>
                  )}

                  <div className="p-5 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
                        {selectedCategory?.name || "Story category"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {blogForm.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                      {blogForm.title.trim() || "Your story title will appear here"}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                      {blogForm.excerpt.trim() ||
                        "Add an excerpt to preview the summary readers will see before they open the full article."}
                    </p>

                    <div className="mt-8">
                      {previewBlocks.length > 0 ? (
                        <BlogArticleContent blocks={previewBlocks} />
                      ) : (
                        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">
                          Start writing in the editor to preview the story body.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start xl:space-y-6">
        <section className="hidden rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 xl:block">
          <h3 className="text-lg font-black text-slate-950">
            Publishing Controls
          </h3>

          <div className="mt-5 space-y-5">
            <CategoryField
              categories={categories}
              value={blogForm.categoryId}
              onChange={(value) => onFieldChange("categoryId", value)}
            />

            <StatusField
              value={blogForm.status}
              onChange={(value) => onFieldChange("status", value)}
            />

            <PublishedAtField
              value={blogForm.publishedAt}
              onChange={(value) => onFieldChange("publishedAt", value)}
            />

            <StatusIndicator status={blogForm.status} />
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">Permalink</h3>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Publish the story to open it on the public site.
              </p>
            </div>
            {blogForm.slug && blogForm.status === "PUBLISHED" ? (
              <a
                href={`/blog/${blogForm.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Live</span>
              </a>
            ) : null}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            /blog/{blogForm.slug || "your-story-slug"}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-6">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-black text-slate-950">Tags</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {tags?.items?.map((tag) => {
              const checked = blogForm.tags.includes(String(tag.id));

              return (
                <label
                  key={tag.id}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    checked
                      ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      const nextTags = event.target.checked
                        ? [...blogForm.tags, String(tag.id)]
                        : blogForm.tags.filter(
                            (selectedTagId) => selectedTagId !== String(tag.id),
                          );

                      onFieldChange("tags", nextTags);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>{tag.name}</span>
                </label>
              );
            })}
          </div>
        </section>

        <div className="hidden flex-col gap-3 xl:flex">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{submitLabel}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 flex-[1.15] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{submitLabel}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
