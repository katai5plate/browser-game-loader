// @ts-check
import { h } from "/_app/libs/preact/dist/preact.module.js";
export { render, Fragment } from "/_app/libs/preact/dist/preact.module.js";
export { useState } from "/_app/libs/preact/hooks/dist/hooks.module.js";
import htm from "/_app/libs/htm/dist/htm.module.js";
const path = require("path");
const fs = require("fs");

export const html = htm.bind(h);

export const getPath = (...paths) =>
  path.join(path.dirname(process.execPath), ...paths);
export const getGamePath = (folderName, ...paths) =>
  getPath("_games", folderName, ...paths);
export const getMetaPath = (folderName, ...paths) =>
  getPath("_meta", folderName, ...paths);

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
        finder(
          fs.readdirSync(filePath).map((name) => path.join(filePath, name))
        );
      } else {
        paths = [...paths, filePath];
      }
    }
  };
  finder(getGamePath(gameDirName));
  return paths
    .filter((filePath) =>
      ["index.html", "package.json"].includes(path.parse(filePath).base)
    )
    .reduce((p, filePath) => {
      const { base } = path.parse(filePath);
      return [...p, { name: base, path: filePath }];
    }, []);
};

/** @type {GameData} */
export const mockGameData = {
  folderName: "game-mv",
  title: "MV製ゲーム",
  alias: "MVのやつ",
  isHTML: true,
  type: "RPG_MAKER_MV",
  updatedAt: "2021-03-07T09:55:24.323Z",
  playedAt: "2021-03-07T09:55:24.323Z",
  screenSize: {
    width: 816,
    height: 624,
  },
  exec: {
    path: "www/index.html",
    name: "index.html",
  },
  files: [],
};
