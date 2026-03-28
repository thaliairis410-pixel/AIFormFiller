import DOMPurify from "isomorphic-dompurify";

const config = {
  html: true,
  ALLOWED_TAGS: [
    "form",
    "input",
    "textarea",
    "select",
    "button",
    "label",
    "a",
    "div",
    "section",
    "iframe",
  ],
  ALLOWED_ATTR: [
    "name",
    "id",
    "type",
    "href",
    "action",
    "method",
    "placeholder",
    "required",
    "value",
  ],
};

export default async function purify(html: string) {
  return DOMPurify.sanitize(html, config);
}
