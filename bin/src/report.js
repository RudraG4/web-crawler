const sortPages = (pages) => {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  return pagesArray;
};

const printReport = (pages) => {
  const sortedPages = sortPages(pages);
  const pageList = sortedPages.reduce((accum, page, index) => {
    accum.push({ page: page[0], hits: page[1] });
    return accum;
  }, []);
  console.table(pageList);
};

module.exports = { sortPages, printReport };
