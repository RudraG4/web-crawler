const { normalizeURL, getUrlsFromHTML } = require("../src/crawl");
const { describe, test, expect } = require("@jest/globals");

describe("normalize url", () => {
  test("strip https", () => {
    const input = "https://codesandbox.io/p/sandbox";
    const actual = normalizeURL(input);
    const expected = "codesandbox.io/p/sandbox";
    expect(actual).toEqual(expected);
  });

  test("strip http", () => {
    const input = "http://codesandbox.io/p/sandbox";
    const actual = normalizeURL(input);
    const expected = "codesandbox.io/p/sandbox";
    expect(actual).toEqual(expected);
  });

  test("trim trailing separator", () => {
    const input = "https://codesandbox.io/p/sandbox/";
    const actual = normalizeURL(input);
    const expected = "codesandbox.io/p/sandbox";
    expect(actual).toEqual(expected);
  });

  test("lower the cases", () => {
    const input = "https://CodeSandbox.io/P/SandBox/";
    const actual = normalizeURL(input);
    const expected = "codesandbox.io/p/sandbox";
    expect(actual).toEqual(expected);
  });
});

describe("get urls from HTML", () => {
  test("absolute URL", () => {
    const inputHTMLBody = `<html lang="en">
    <body>
    <a href="https://codesandbox.io/static/js/sandbox.6027c6c97.js">ITEM1</a>
    <a href="https://codesandbox.io/static/js/banner.be879265d.js">ITEM2</a>
    <a href="https://codesandbox.io/static/js/watermark-button.be960f43b.js">ITEM3</a>
    </body>
    </html>`;
    const inputBaseURL = "https://codesandbox.io";
    const actualOutput = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expectedOutput = [
      "https://codesandbox.io/static/js/sandbox.6027c6c97.js",
      "https://codesandbox.io/static/js/banner.be879265d.js",
      "https://codesandbox.io/static/js/watermark-button.be960f43b.js",
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });

  test("relative URL", () => {
    const inputHTMLBody = `<html lang="en">
    <body>
    <a href="/static/js/sandbox.6027c6c97.js">ITEM1</a>
    <a href="/static/js/banner.be879265d.js">ITEM2</a>
    <a href="https://codesandbox.io/static/js/watermark-button.be960f43b.js">ITEM3</a>
    <a>ITEM4</a>
    </body>
    </html>`;
    const inputBaseURL = "https://codesandbox.io";
    const actualOutput = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expectedOutput = [
      "https://codesandbox.io/static/js/sandbox.6027c6c97.js",
      "https://codesandbox.io/static/js/banner.be879265d.js",
      "https://codesandbox.io/static/js/watermark-button.be960f43b.js",
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });

  test("ignore invalid URL", () => {
    const inputHTMLBody = `<html lang="en">
    <body>
    <a href="/static/js/sandbox.6027c6c97.js">ITEM1</a>
    <a href="/static/js/banner.be879265d.js">ITEM2</a>
    <a href="https://codesandbox.io/static/js/watermark-button.be960f43b.js">ITEM3</a>
    <a>ITEM4</a>
    <a href="aasef?aj">ITEM4</a>
    <a href="codesandbox.io/aasef+ahsj=/?aj">ITEM4</a>
    </body>
    </html>`;
    const inputBaseURL = "https://codesandbox.io";
    const actualOutput = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expectedOutput = [
      "https://codesandbox.io/static/js/sandbox.6027c6c97.js",
      "https://codesandbox.io/static/js/banner.be879265d.js",
      "https://codesandbox.io/static/js/watermark-button.be960f43b.js",
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
});
