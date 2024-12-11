const dotenv = require("dotenv");

// For passthroughcopy config, see https://www.11ty.dev/docs/copy/
module.exports = function (eleventyConfig) {
  dotenv.config();

  // while in --serve, do not copy passthroughcopy'ed files, serve them directly.
  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // src/_static is just copied directly to the root of the site.
  eleventyConfig.ignores.add("src/_static/");
  eleventyConfig.addPassthroughCopy({ "src/_static/": "/" });

  // TODO: #6 Document the shortcodes in the readme
  // Adding my own utility shortcodes
  eleventyConfig.addShortcode("thisYear", function () {
    return new Date().getFullYear();
  });
  eleventyConfig.addShortcode("getYTVideoId", function (url) {
    return url.split("v=")[1].split("&")[0];
  });
  // get the value of a variable in process.env[varname]
  eleventyConfig.addShortcode("envar", function (varname) {
    return process.env[varname];
  });

  // eleventy watch files needs this in WSL
  eleventyConfig.setChokidarConfig({
    usePolling: true,
    interval: 500,
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      // ⚠️ This value is relative to your input directory.
      includes: "_includes",
    },
    // Markdown files run through this template engine before transforming to HTML
    markdownTemplateEngine: "njk",
    // A prefix directory added to links, default '/'
    // usefull when the site will be in a subdirectory, such as github pages
    // pathPrefix: '/',
  };
};
