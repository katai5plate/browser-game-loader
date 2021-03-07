const replaceCode = require("./libs/replaceCode");

const [, , FILENAME, A, B] = process.argv;

(() => {
  replaceCode(FILENAME, A, B);
})();
