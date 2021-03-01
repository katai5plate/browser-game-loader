const path = require("path");
const fs = require("fs-extra");
const { resolve } = require("path");

const GAME_DIR = "./_games";

/**
 * ファイルパスがディレクトリかどうか調べる
 * @param {string} filePath
 */
const isDir = (filePath) => {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (e) {
    // console.log(e);
    return false;
  }
};

/**
 * ゲームフォルダから index.html, package.json を検索
 * @param {string} gameDirName
 */
const findGameMetaFiles = (gameDirName) => {
  let paths = [];
  const finder = (x) => {
    for (let filePath of x) {
      if (isDir(filePath)) {
        finder(fs.readdirSync(filePath).map((name) => `${filePath}/${name}`));
      } else {
        paths = [...paths, filePath];
      }
    }
  };
  finder([`${GAME_DIR}/${gameDirName}`]);
  return paths
    .filter((filePath) =>
      ["index.html", "package.json"].includes(path.parse(filePath).base)
    )
    .reduce((p, filePath) => {
      const { base } = path.parse(filePath);
      return [...p, { name: base, path: filePath }];
    }, []);
};

(async () => {
  document.write(
    JSON.stringify(
      findGameMetaFiles(fs.readdirSync(GAME_DIR).slice(-1)[0]),
      null,
      2
    ).replace(/\n/g, "<br/>")
  );
})();
