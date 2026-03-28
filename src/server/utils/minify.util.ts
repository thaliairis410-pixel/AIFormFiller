import minifier from "html-minifier";

const config = {
  collapseWhitespace: true,
  removeComments: true,
  removeEmptyAttributes: true,
};

export default async function minify(html: string) {
  return minifier.minify(html, config);
}
