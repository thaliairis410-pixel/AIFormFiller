import DOMPurify from "isomorphic-dompurify";

const config = {
  html: true,
  ALLOWED_TAGS: [
    // Form elements
    "form",
    "input",
    "textarea",
    "select",
    "option",
    "optgroup",
    "button",
    "label",
    "fieldset",
    "legend",
    // Semantic containers
    "a",
    "div",
    "span",
    "p",
    "article",
    "section",
    "header",
    "footer",
    // Embedding
    "iframe",
  ],
  ALLOWED_ATTR: [
    // Basic form attributes
    "name",
    "id",
    "class", // CRITICAL: class names identify form purpose
    "type",
    "href",
    "action",
    "method",
    "placeholder",
    "required",
    "value",
    // Accessibility attributes (huge help for AI)
    "role", // <div role="form"> for SPA forms
    "aria-label",
    "aria-required",
    "aria-describedby",
    "aria-labelledby",
    // Validation hints
    "minlength",
    "maxlength",
    "pattern",
    "autocomplete",
    // Modern framework markers
    "data-testid",
    "data-form-type", // e.g., data-form-type="contact"
    "data-field-name", // custom field naming
    // State
    "disabled",
    "readonly",
  ],
};

export default async function purify(html: string) {
  return DOMPurify.sanitize(html, config);
}
