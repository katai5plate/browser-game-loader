import {
  h,
  render,
  Fragment as _Fragment,
} from "/_app/libs/preact/dist/preact.module.js";
import {} from "/_app/libs/preact/hooks/dist/hooks.module.js";
import htm from "/_app/libs/htm/dist/htm.module.js";
const path = require("path");
const fs = require("fs-extra");

export const CWD_PATH = process.cwd().replace(/\\/g, "/");
export const GAME_DIR = CWD_PATH + "/_games";

export const renderer = () => render;
export const html = htm.bind(h);
export const Fragment = _Fragment;

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
