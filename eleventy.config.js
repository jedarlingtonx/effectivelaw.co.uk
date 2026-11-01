const fs = require("node:fs");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  // Everything hand-written (pages, styles, scripts, images, icons) is copied
  // through exactly as it is. Only Markdown and .njk files are processed.
  eleventyConfig.addPassthroughCopy("src/**/*.{html,css,png,jpg,jpeg,webp,svg,ico,txt,yml}");
  eleventyConfig.addPassthroughCopy("src/*.js"); // site.js, consent.js (not the data files)

  // Sveltia CMS is served from this site (no third-party CDN), so editors'
  // browsers do not contact anyone else when the admin page loads.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const from = path.join(__dirname, "node_modules/@sveltia/cms/dist");
    const to = path.join(__dirname, dir.output, "admin/cms");
    fs.cpSync(from, to, {
      recursive: true,
      filter: (src) => !src.endsWith(".map") && !src.endsWith(".mjs"),
    });
  });

  // Markdown from the CMS: no raw HTML, tidy quotes, links made clickable.
  eleventyConfig.amendLibrary("md", (md) => md.set({ html: false, linkify: true, typographer: true }));

  // Published, non-draft articles, newest first.
  eleventyConfig.addCollection("articles", (api) =>
    api
      .getFilteredByGlob("src/effective-perspective/articles/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  const toDate = (value) => (value instanceof Date ? value : new Date(value));
  eleventyConfig.addFilter("readableDate", (value) =>
    toDate(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })
  );
  eleventyConfig.addFilter("isoDate", (value) => toDate(value).toISOString().slice(0, 10));
  // JSON for <script type="application/ld+json">; "<" is escaped so text can never close the tag.
  eleventyConfig.addFilter("jsonld", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: false, // article text is never treated as a template
    htmlTemplateEngine: false,
  };
};
