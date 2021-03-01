// ./nw/ から Git 管理対象以外のファイルを削除する

const fs = require("fs-extra");

const NW_DIR_PATH = process.cwd().replace(/\\/g, "/") + "/nw/";
fs.readdirSync(NW_DIR_PATH)
  .filter(
    (name) =>
      ![
        "index.html",
        "package.json",
        "LICENSES.md",
        "README.txt",
        "_app",
        "_games",
      ].includes(name)
  )
  .forEach((name) => {
    const path = `${NW_DIR_PATH}${name}`;
    try {
      fs.removeSync(path);
      console.log("DELETED " + name);
    } catch (error) {
      console.log("DELETE FAILED! " + name);
      console.error(error);
    }
  });
