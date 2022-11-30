const { JSDOM } = require("jsdom");
const logger = require("./log");

const getUrlsFromHTML = (htmlbody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlbody);
  const links = dom.window.document.querySelectorAll("a");
  for (const link of links) {
    if (link.href) {
      if (link.href.startsWith("/")) {
        try {
          const url = new URL(`${baseURL}${link.href}`);
          urls.push(url.href);
        } catch (error) {}
      } else {
        try {
          const url = new URL(link.href);
          urls.push(url.href);
        } catch (error) {}
      }
    }
  }
  return urls;
};

const normalizeURL = (urlString) => {
  const URLObj = new URL(urlString);
  const hostPath = `${URLObj.hostname}${URLObj.pathname}`;
  if (hostPath && hostPath.endsWith("/")) {
    return hostPath.slice(0, -1).toLowerCase();
  }
  return hostPath.toLowerCase();
};

const crawl = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname != currentURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  pages[normalizedURL] = 1;

  logger.info(`Crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      logger.error(
        `Couldn't fetch ${currentURL} due to status code: ${resp.status}`
      );
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      logger.error(
        `Non-HTML Response. Content-Type ${contentType} returned on page ${currentURL}`
      );
      return pages;
    }
    const htmlBody = await resp.text();
    const nextURLs = getUrlsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawl(baseURL, nextURL, pages);
    }
  } catch (error) {
    logger.error(`Error crawling the ${currentURL} website: ${error.message}`);
  }
  return pages;
};

module.exports = {
  normalizeURL,
  getUrlsFromHTML,
  crawl,
};
