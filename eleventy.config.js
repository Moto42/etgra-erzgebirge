const dotenv = require("dotenv");
const markdownit = require('markdown-it');
const { EleventyRenderPlugin } = require("@11ty/eleventy");

// For passthroughcopy config, see https://www.11ty.dev/docs/copy/
module.exports = function (eleventyConfig) {
  dotenv.config();

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // while in --serve, do not copy passthroughcopy'ed files, serve them directly.
  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // src/_static is just copied directly to the root of the site.
  eleventyConfig.ignores.add("src/_static/");
  eleventyConfig.addPassthroughCopy({ "src/_static/": "/" });

  eleventyConfig.addFilter("parseMarkdown", function(content){
    const md = markdownit();
    return md.render(content);
  });

  const hlvl2height = {
    h1: "h-36",
    h2: "h-30", 
    h3: "h-20",
    h4: "h-16",
    h5: "h-12",
    h6: "h-8",
  }
  const widgets_banner_divClasses = headinglevel => `${hlvl2height[headinglevel]} p-4 flex items-end relative`;
  const widgets_banner_imgclass = `w-full h-full absolute top-0 left-0 bg-cover bg-center bg-no-repeat filter-bannerimg`;
  const widgets_banner_headingClasses = `w-full  text-white font-bold z-10`;
  eleventyConfig.addShortcode("widgets_banner", function (headinglevel, headline, image) {
    return `<div class="${widgets_banner_divClasses(headinglevel)}"><div class="${widgets_banner_imgclass}" style="background-image: url('${image}');">&nbsp;</div><${headinglevel} class="${widgets_banner_headingClasses}">${headline}</${headinglevel}></div>`;
  });

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
  eleventyConfig.addShortcode("dumpToConsole", function(somevar){
    console.dir(somevar);
    return "";
  });
  eleventyConfig.addShortcode("random4Digit", function () {
    return Math.floor(1000 + Math.random() * 9000);
  });
  /**
   * Convert a multiline string to a single line
   */
  eleventyConfig.addPairedShortcode("oneline", function(value) {
    value = value.replaceAll(/\s+/g,' ');
    return value;
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
