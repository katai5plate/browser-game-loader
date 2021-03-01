import { h } from "/_app/libs/preact.module.js";
import htm from "/_app/libs/htm.module.js";
const path = require("path");
const fs = require("fs-extra");

export const CWD_PATH = process.cwd().replace(/\\/g, "/");
export const GAME_DIR = process.cwd().replace(/\\/g, "/") + "/_games";

export const html = htm.bind(h);

/**
 * ファイルパスがディレクトリかどうか調べる
 * @param {string} filePath
 */
export const isDir = (filePath) => {
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
export const findGameMetaFiles = (gameDirName) => {
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
