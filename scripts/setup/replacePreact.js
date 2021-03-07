const path = require("path");
const replaceCode = require("../libs/replaceCode");

(() => {
  replaceCode(
    path.join(process.cwd(), "/nw/_app/libs/preact/hooks/dist/hooks.module.js"),
    'from"preact"',
    'from"/_app/libs/preact/dist/preact.module.js"'
  );
})();
