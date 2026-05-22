function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeRichText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripInlineFormatting(value = "") {
  return stripHtml(
    String(value)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2"),
  );
}

export function parseContentString(content) {
  const trimmedContent = String(content || "").trim();

  if (!trimmedContent) {
    return null;
  }

  if (
    (trimmedContent.startsWith("{") && trimmedContent.endsWith("}")) ||
    (trimmedContent.startsWith("[") && trimmedContent.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmedContent);
    } catch {
      return null;
    }
  }

  return null;
}

function createParagraphBlocksFromText(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((paragraph) => sanitizeRichText(paragraph))
    .filter(Boolean)
    .map((paragraph, index) => ({
      id: `paragraph-${index}`,
      type: "paragraph",
      text: paragraph,
    }));
}

function normalizeHeaderLevel(level = 2) {
  return Number(level) >= 3 ? 3 : 2;
}

function parseEditorTextBlocks(text = "") {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      blocks.push({
        id: `header-${blocks.length}`,
        type: "header",
        level: normalizeHeaderLevel(headerMatch[1].length),
        text: sanitizeRichText(headerMatch[2]),
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmedLine)) {
      const quoteLines = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      const lastLine = quoteLines.at(-1) || "";
      const captionMatch = lastLine.match(/^(?:--|—)\s+(.+)$/);
      const textLines = captionMatch ? quoteLines.slice(0, -1) : quoteLines;
      const quoteText = sanitizeRichText(textLines.join(" "));
      const caption = captionMatch ? sanitizeRichText(captionMatch[1]) : "";

      if (quoteText) {
        blocks.push({
          id: `quote-${blocks.length}`,
          type: "quote",
          text: quoteText,
          caption,
        });
      }

      continue;
    }

    const unorderedListMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    const orderedListMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);

    if (unorderedListMatch || orderedListMatch) {
      const listStyle = orderedListMatch ? "ordered" : "unordered";
      const items = [];
      const matcher =
        listStyle === "ordered" ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;

      while (index < lines.length) {
        const listMatch = lines[index].trim().match(matcher);

        if (!listMatch) {
          break;
        }

        const itemText = sanitizeRichText(listMatch[1]);

        if (itemText) {
          items.push(itemText);
        }

        index += 1;
      }

      if (items.length > 0) {
        blocks.push({
          id: `list-${blocks.length}`,
          type: "list",
          style: listStyle,
          items,
        });
      }

      continue;
    }

    const paragraphLines = [];

    while (index < lines.length && lines[index].trim()) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    const paragraphText = sanitizeRichText(paragraphLines.join(" "));

    if (paragraphText) {
      blocks.push({
        id: `paragraph-${blocks.length}`,
        type: "paragraph",
        text: paragraphText,
      });
    }
  }

  return blocks;
}

function normalizeStoredBlock(block, index) {
  const blockType = block?.type || "paragraph";
  const blockData = block?.data || block || {};

  if (blockType === "header") {
    return {
      id: block?.id || `header-${index}`,
      type: "header",
      level: normalizeHeaderLevel(blockData.level || 2),
      text: sanitizeRichText(blockData.text || ""),
    };
  }

  if (blockType === "list") {
    return {
      id: block?.id || `list-${index}`,
      type: "list",
      style: blockData.style || "unordered",
      items: (blockData.items || [])
        .map((item) => sanitizeRichText(typeof item === "string" ? item : ""))
        .filter(Boolean),
    };
  }

  if (blockType === "quote") {
    return {
      id: block?.id || `quote-${index}`,
      type: "quote",
      text: sanitizeRichText(blockData.text || ""),
      caption: sanitizeRichText(blockData.caption || ""),
    };
  }

  return {
    id: block?.id || `paragraph-${index}`,
    type: "paragraph",
    text: sanitizeRichText(blockData.text || block.text || ""),
  };
}

function buildStoredBlock(block) {
  if (block.type === "header") {
    return {
      type: "header",
      data: {
        text: block.text,
        level: normalizeHeaderLevel(block.level),
      },
    };
  }

  if (block.type === "list") {
    return {
      type: "list",
      data: {
        style: block.style === "ordered" ? "ordered" : "unordered",
        items: block.items,
      },
    };
  }

  if (block.type === "quote") {
    return {
      type: "quote",
      data: {
        text: block.text,
        ...(block.caption ? { caption: block.caption } : {}),
      },
    };
  }

  return {
    type: "paragraph",
    data: {
      text: block.text,
    },
  };
}

function blocksToEditorText(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "header") {
        return `${block.level >= 3 ? "###" : "##"} ${block.text}`;
      }

      if (block.type === "list") {
        return block.items
          .map((item, index) =>
            block.style === "ordered" ? `${index + 1}. ${item}` : `- ${item}`,
          )
          .join("\n");
      }

      if (block.type === "quote") {
        return [`> ${block.text}`, block.caption ? `> -- ${block.caption}` : ""]
          .filter(Boolean)
          .join("\n");
      }

      return block.text;
    })
    .filter(Boolean)
    .join("\n\n");
}

function blocksToText(blocks) {
  return blocks
    .flatMap((block) => {
      if (block.type === "list") {
        return block.items.map((item) => stripInlineFormatting(item));
      }

      if (block.type === "quote") {
        return [
          stripInlineFormatting(block.text),
          stripInlineFormatting(block.caption || ""),
        ];
      }

      return [stripInlineFormatting(block.text)];
    })
    .filter(Boolean)
    .join(" ");
}

export function normalizeContentBlocks(content, fallbackText = "") {
  if (!content) {
    return createParagraphBlocksFromText(fallbackText);
  }

  if (typeof content === "string") {
    const parsedContent = parseContentString(content);

    if (parsedContent) {
      return normalizeContentBlocks(parsedContent, fallbackText);
    }

    const editorBlocks = parseEditorTextBlocks(content);

    return editorBlocks.length > 0
      ? editorBlocks
      : createParagraphBlocksFromText(content || fallbackText);
  }

  if (Array.isArray(content)) {
    return content
      .map((block, index) => normalizeStoredBlock(block, index))
      .filter((block) => {
        if (block.type === "list") {
          return block.items.length > 0;
        }

        return Boolean(block.text);
      });
  }

  if (Array.isArray(content?.blocks)) {
    return content.blocks
      .map((block, index) => normalizeStoredBlock(block, index))
      .filter((block) => {
        if (block.type === "list") {
          return block.items.length > 0;
        }

        return Boolean(block.text);
      });
  }

  return createParagraphBlocksFromText(fallbackText);
}

export function extractContentText(content, fallbackText = "") {
  if (!content) {
    return stripInlineFormatting(fallbackText);
  }

  if (typeof content === "string") {
    const parsedContent = parseContentString(content);

    if (parsedContent) {
      return extractContentText(parsedContent, fallbackText);
    }

    const editorBlocks = parseEditorTextBlocks(content);

    return editorBlocks.length > 0
      ? blocksToText(editorBlocks)
      : stripInlineFormatting(content);
  }

  if (Array.isArray(content) || Array.isArray(content?.blocks)) {
    return blocksToText(normalizeContentBlocks(content, fallbackText));
  }

  return stripInlineFormatting(fallbackText);
}

export function formatEditorContent(content) {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    const parsedContent = parseContentString(content);

    if (!parsedContent) {
      return content;
    }

    return blocksToEditorText(normalizeContentBlocks(parsedContent));
  }

  return blocksToEditorText(normalizeContentBlocks(content));
}

export function normalizeContentInput(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return { blocks: [] };
  }

  const parsedValue = parseContentString(trimmedValue);

  if (parsedValue) {
    return parsedValue;
  }

  return {
    blocks: parseEditorTextBlocks(trimmedValue).map((block) =>
      buildStoredBlock(block),
    ),
  };
}
