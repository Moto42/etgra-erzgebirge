const dotenv = require("dotenv");
const markdownit = require("markdown-it");
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

  eleventyConfig.addFilter("parseMarkdown", function (content) {
    const md = markdownit();
    return md.render(content);
  });

  eleventyConfig.addFilter("addIdsToHeadings", addIdsToHeadings);

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
  eleventyConfig.addShortcode("dumpToConsole", function (somevar) {
    console.dir(somevar);
    return "";
  });
  eleventyConfig.addShortcode("random4Digit", function () {
    return Math.floor(1000 + Math.random() * 9000);
  });
  eleventyConfig.addShortcode("sidebarLinkify", sidebarLinkify);
  /**
   * Convert a multiline string to a single line
   */
  eleventyConfig.addPairedShortcode("oneline", function (value) {
    value = value.replaceAll(/\s+/g, " ");
    return value;
  });

  // eleventy watch files needs this in WSL
  eleventyConfig.setChokidarConfig({
    usePolling: true,
    interval: 500,
  });

  // Automatically import macros on every page
  // (otherwise we need to manually include on each page that uses them)
  // https://github.com/11ty/eleventy/issues/613#issuecomment-968189433
  eleventyConfig.addCollection('all markdown files', (collectionApi) => {
    // Note: Update the path to point to your macro file
    const macroImport = `{% import "widgets/banners.njk" as banners with context %}`;
    // Note: Update the pattern below to include all files that need macros imported
    // Note: Collections don’t include layouts or includes, which still require importing macros manually
    let collection = collectionApi.getFilteredByGlob('src/**/*.md');
    collection.forEach((item) => {
      item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`
    })
    return collection;
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

/** Takes HTML and creates a list of links to each of the heading tags in the page
 * 
 * @param {string} html - HTML of the page
 */
function sidebarLinkify(html) {
  // create an array of each of the headings in the page
  const headings = html.match(/<h[1-6].*?>.*?<\/h[1-6]>/g);

  if (!headings) return "";
  // map each heading to a link to that heading's id, and adds a "data-headinglevel" attribute with the number of the heading level.
  const links = headings.map((heading) => {
    const id = (heading.match(/id=".*?"/)||['null'])[0].replace(/id="|"/g, "");
    const text = heading.replace(/<.*?>|<\/.*?>/g, "");
    const level = heading.match(/<h([1-6])/)[1];
    return `<a href="#${id}" data-headinglevel="${level}">${text}</a>`;
  });

  /** convert the array of links to a string of HTML with each link in a set of 
   *  nested unordered lists based on it's heading level, and returns the string.
   */
  // the heading level of the set of headings we are currently in
  let current_level = links[0].match(/data-headinglevel="(\d)"/)[1];
  // how deep into the stack of nested lists we are
  let depth = 1;
  const ul_html = links.reduce((acc, link) => {
    // the heading level of the current link
    const level = link.match(/data-headinglevel="(\d)"/)[1];
    if (level === current_level) {
      // if the level is the same as the current level, just add the link to the current list
      return `${acc}<li>${link}</li>`;
    } else if (level > current_level) {
      // if the level is higher than the current level, add a new list and add the link to that list
      current_level = level;
      depth++;
      return `${acc}<ul><li>${link}</li>`;
    } else {
      // if the level is lower than the current level, close lists until we are
      // at the correct level, then add the link to the current list
      current_level = level;
      while (depth > current_level) {
        depth--;
        acc += "</ul>";
      }
      return `${acc}<li>${link}</li>`;
    }
  }, "<ul>");

  return ul_html;
}

function idFromInnerText(text) {
  return text.toLowerCase().replace(/[aeiou\s\W]/g, "");
}

/** takes HTML and adds an ID to all heading tags, using the idFromInnerText function to generate the id  returning the new html*/
function addIdsToHeadings(html) {
  const headings = html.match(/<h[1-6].*?>.*?<\/h[1-6]>/g);
  if (!headings) return html;
  const newHtml = headings.reduce((acc, heading) => {
    const id = idFromInnerText(heading.replace(/<.*?>|<\/.*?>/g, ""));
    const newheading = heading.replace(/<(h[1-6])(.*)>(.*)<\/(h[1-6])>/, `<$1 id="${id}" $2>$3</$4>`);
    console.log('\n',heading,'\n',newheading);
    return acc.replace(heading, newheading);
  }, html);
  return newHtml;
}