import headerLogo from "./assets/img/logo/header.png";
import footerLogo from "./assets/img/logo/logo.png";

// One build serves both soshellmedia.co and letaihandle.com; only the logo, favicon and name differ.
// The letaihandle logo lives in public/ so it can be swapped without a code change.
export const isLetAiHandle = window.location.hostname.includes("letaihandle");

export const HEADER_LOGO = isLetAiHandle ? "/letaihandle-logo.png" : headerLogo;
export const FOOTER_LOGO = isLetAiHandle ? "/letaihandle-logo.png" : footerLogo;

// Matches "Soshell Media" and "Soshell" as words, but not emails or URLs like soshellmedia.co.
const SOSHELL_NAME = /\bsoshell(\s+media)?\b/gi;
const NAMED_ATTRS = ["alt", "title", "placeholder", "aria-label", "content"];

const rename = (value) => value.replace(SOSHELL_NAME, "LetAIHandle");

const renameNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const next = rename(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) renameNode(walker.currentNode);
  for (const el of [node, ...node.querySelectorAll("*")]) {
    for (const attr of NAMED_ATTRS) renameAttr(el, attr);
  }
};

const renameAttr = (el, attr) => {
  const value = el.getAttribute(attr);
  if (value === null) return;
  const next = rename(value);
  if (next !== value) el.setAttribute(attr, next);
};

if (isLetAiHandle) {
  const favicon = document.querySelector('link[rel="icon"]');
  favicon?.setAttribute("type", "image/png");
  favicon?.setAttribute("href", "/letaihandle-favicon.png");

  // Text from the code and from the API (SEO titles, page content) both say
  // Soshell Media, so rename it in the page as it renders, tab title included.
  renameNode(document.documentElement);
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "characterData") renameNode(m.target);
      else if (m.type === "attributes") renameAttr(m.target, m.attributeName);
      else m.addedNodes.forEach(renameNode);
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: NAMED_ATTRS,
  });
}
