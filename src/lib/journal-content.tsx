import { createElement, type ReactNode } from "react";
import { parseFragment, type DefaultTreeAdapterTypes } from "parse5";
import { safePublicHref } from "@/lib/public-href";

const tags = new Set(["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "blockquote", "figure", "figcaption", "br"]);
const classes: Record<string, string> = {
  h2: "pt-3 text-2xl font-bold text-bone",
  h3: "text-lg font-bold text-bone",
  ul: "list-disc space-y-2 ps-6",
  ol: "list-decimal space-y-2 ps-6",
  figcaption: "mt-2 text-sm text-mute",
};

function render(node: DefaultTreeAdapterTypes.ChildNode, key: number): ReactNode {
  if ("value" in node) return node.value;
  if (!("tagName" in node)) return null;
  const { tagName, attrs, childNodes } = node;
  if (node.namespaceURI !== "http://www.w3.org/1999/xhtml") return null;
  const attribute = (name: string) => attrs.find((item) => item.name === name)?.value;
  if (tagName === "img") {
    const src = safePublicHref(attribute("src"));
    return src ? <img key={key} src={src} alt={attribute("alt") ?? ""} loading="lazy" decoding="async" className="h-auto w-full rounded-xl" /> : null;
  }
  if (tagName === "script" || tagName === "style" || tagName === "iframe") return null;
  const children = childNodes.map(render);
  if (tagName === "a") {
    const href = safePublicHref(attribute("href"));
    return href ? <a key={key} href={href} className="font-semibold text-signal underline underline-offset-4">{children}</a> : children;
  }
  return createElement(tags.has(tagName) ? tagName : "span", { key, className: classes[tagName] }, tagName === "br" ? undefined : children);
}

export function JournalContent({ content }: { content?: string }) {
  if (!content) return null;
  const nodes = parseFragment(content).childNodes;
  return <article dir="rtl" className="space-y-6 text-[15px] leading-9 text-metal">{nodes.map(render)}</article>;
}
