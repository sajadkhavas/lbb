import { createElement, Fragment, type ReactNode } from "react";
import { parseFragment, type DefaultTreeAdapterTypes } from "parse5";

const tags: Record<string, string> = {
  p: "p",
  h1: "h3",
  h2: "h3",
  h3: "h4",
  h4: "h4",
  ul: "ul",
  ol: "ol",
  li: "li",
  strong: "strong",
  b: "strong",
  em: "em",
  i: "em",
  br: "br",
  blockquote: "blockquote",
};

function renderNode(node: DefaultTreeAdapterTypes.ChildNode, key: number): ReactNode {
  if ("value" in node) return node.value;
  if (!("tagName" in node) || node.namespaceURI !== "http://www.w3.org/1999/xhtml") {
    return null;
  }
  if (["script", "style", "template", "iframe", "object"].includes(node.tagName)) return null;

  const children = node.childNodes.map(renderNode);
  if (node.tagName === "a") {
    const href = node.attrs.find((attr) => attr.name === "href")?.value.trim();
    return href && /^(?:\/(?![/\\])|#|https?:\/\/)/i.test(href) ? (
      <a key={key} href={href}>
        {children}
      </a>
    ) : (
      <span key={key}>{children}</span>
    );
  }
  const tag = Object.hasOwn(tags, node.tagName) ? tags[node.tagName] : undefined;
  if (tag === "br") return <br key={key} />;
  return createElement(tag ?? Fragment, { key }, children);
}

export function ProductDescription({ description }: { description: string }) {
  let { childNodes } = parseFragment(description);
  const first = childNodes[0];
  if (childNodes.length === 1 && first && "value" in first) {
    if (/<\/?(?:p|h[1-4]|ul|ol|li|strong|em|a|br|blockquote)\b/i.test(first.value)) {
      childNodes = parseFragment(first.value).childNodes;
    } else {
      return (
        <p className="mt-4 whitespace-pre-line text-sm leading-8 text-metal [overflow-wrap:anywhere]">
          {description}
        </p>
      );
    }
  }

  return (
    <div className="mt-4 space-y-4 text-sm leading-8 text-metal [overflow-wrap:anywhere] [&_a]:font-semibold [&_a]:text-bone [&_a]:underline [&_blockquote]:border-s-2 [&_blockquote]:border-signal [&_blockquote]:ps-4 [&_h3]:pt-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-bone [&_h4]:font-bold [&_h4]:text-bone [&_ol]:list-decimal [&_ol]:ps-5 [&_strong]:text-bone [&_ul]:list-disc [&_ul]:ps-5">
      {childNodes.map(renderNode)}
    </div>
  );
}
