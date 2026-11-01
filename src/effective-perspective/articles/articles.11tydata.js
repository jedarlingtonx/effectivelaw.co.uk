// Settings shared by every article written in the content manager.
module.exports = {
  layout: "article.njk",
  section: "insights",
  eleventyComputed: {
    // A draft is not published: no page is made for it.
    permalink: (data) => (data.draft ? false : `/effective-perspective/${data.page.fileSlug}/`),
  },
};
