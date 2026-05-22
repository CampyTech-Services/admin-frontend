function resolveHref(value = "") {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("mailto:") ||
    trimmedValue.startsWith("tel:") ||
    trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("#")
  ) {
    return trimmedValue;
  }

  return "";
}

function renderInlineContent(text, keyPrefix = "inline") {
  const value = String(text || "");
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_)/;
  const nodes = [];
  let remainder = value;
  let index = 0;

  while (remainder) {
    const match = remainder.match(pattern);

    if (!match) {
      nodes.push(remainder);
      break;
    }

    const matchedText = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > 0) {
      nodes.push(remainder.slice(0, matchIndex));
    }

    if (match[2] && match[3]) {
      const href = resolveHref(match[3]);

      if (href) {
        const isExternalLink = /^https?:\/\//.test(href);

        nodes.push(
          <a
            key={`${keyPrefix}-${index}`}
            href={href}
            className="font-semibold text-cyan-700 underline decoration-cyan-200 underline-offset-4 transition hover:text-cyan-800 hover:decoration-cyan-400"
            target={isExternalLink ? "_blank" : undefined}
            rel={isExternalLink ? "noreferrer" : undefined}
          >
            {renderInlineContent(match[2], `${keyPrefix}-${index}-link`)}
          </a>,
        );
      } else {
        nodes.push(match[2]);
      }
    } else if (match[4] || match[5]) {
      const boldText = match[4] || match[5];

      nodes.push(
        <strong key={`${keyPrefix}-${index}`} className="font-black text-slate-950">
          {renderInlineContent(boldText, `${keyPrefix}-${index}-bold`)}
        </strong>,
      );
    } else {
      const italicText = match[6] || match[7];

      nodes.push(
        <em key={`${keyPrefix}-${index}`} className="italic text-slate-800">
          {renderInlineContent(italicText, `${keyPrefix}-${index}-italic`)}
        </em>,
      );
    }

    remainder = remainder.slice(matchIndex + matchedText.length);
    index += 1;
  }

  return nodes;
}

export function BlogArticleContent({ blocks }) {
  return (
    <div className="space-y-6 text-base leading-8 text-slate-700 sm:text-lg">
      {blocks.map((block) => {
        if (block.type === "header") {
          if (block.level >= 3) {
            return (
              <h3
                key={block.id}
                className="text-2xl font-black tracking-tight text-slate-950"
              >
                {renderInlineContent(block.text, `${block.id}-text`)}
              </h3>
            );
          }

          return (
            <h2
              key={block.id}
              className="text-3xl font-black tracking-tight text-slate-950"
            >
              {renderInlineContent(block.text, `${block.id}-text`)}
            </h2>
          );
        }

        if (block.type === "list") {
          const ListTag = block.style === "ordered" ? "ol" : "ul";

          return (
            <ListTag
              key={block.id}
              className={`space-y-3 pl-6 ${
                block.style === "ordered" ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, index) => (
                <li key={`${block.id}-${index}`}>
                  {renderInlineContent(item, `${block.id}-${index}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={block.id}
              className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50 px-6 py-5 text-lg font-medium italic text-slate-800"
            >
              <p>{renderInlineContent(block.text, `${block.id}-text`)}</p>
              {block.caption && (
                <footer className="mt-3 text-sm font-semibold not-italic text-cyan-700">
                  {renderInlineContent(block.caption, `${block.id}-caption`)}
                </footer>
              )}
            </blockquote>
          );
        }

        return <p key={block.id}>{renderInlineContent(block.text, `${block.id}-text`)}</p>;
      })}
    </div>
  );
}
