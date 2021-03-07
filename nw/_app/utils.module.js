// @ts-check
import { h } from "/_app/libs/preact/dist/preact.module.js";
export { render, Fragment } from "/_app/libs/preact/dist/preact.module.js";
export {
  useState,
  useEffect,
} from "/_app/libs/preact/hooks/dist/hooks.module.js";
import htm from "/_app/libs/htm/dist/htm.module.js";
const path = require("path");
const fs = require("fs");

export const html = htm.bind(h);

export const getPath = (...paths) =>
  path.join(path.dirname(process.execPath), ...paths);
export const getGamePath = (folderName, ...paths) =>
  getPath("_games", ...(folderName ? [folderName, ...paths] : []));
export const getMetaPath = (...paths) => getPath("_meta", ...paths);

export const getSettings = () =>
  JSON.parse(
    fs.readFileSync(getMetaPath("settings.json"), { encoding: "utf8" })
  );

const getPluginPath = (...paths) => getPath("_plugins", ...paths);

/**
 * @returns {PluginFile[]}
 */
const importAllPlugins = () =>
  getSettings().pluginPriority.map((pluginName) =>
    JSON.parse(
      fs.readFileSync(getPluginPath(`${pluginName}.json`), { encoding: "utf8" })
    )
  );

export const importLib = (...paths) =>
  require(getPath("_app", "libs", ...paths));

export const libs = {
  /** @type {import('/_app/libs/slash/index.js')} */
  slash: importLib("slash", "index.js"),
  /** @type {import('/_app/libs/adm-zip/adm-zip.js')} */
  admZip: importLib("adm-zip", "adm-zip.js"),
};

export const getServerUrl = (...paths) =>
  libs.slash(
    path.join("http://localhost:" + getSettings().port + "/", ...paths)
  );

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
 * ゲームフォルダから GameData を取得
 * @param {string} folderName
 */
export const analyzeGame = (folderName) => {
  // ファイルリストを取得
  let fullPathFiles = [];
  const finder = (x) => {
    for (let filePath of x) {
      if (isDir(filePath)) {
        finder(
          fs.readdirSync(filePath).map((name) => path.join(filePath, name))
        );
      } else {
        fullPathFiles = [...fullPathFiles, filePath];
      }
    }
  };
  finder([getGamePath(folderName)]);
  // プラグインの定義ファイルを使用した検証を行う
  const pickupAddress = ({ type, file, position }, getRootDirPath) => {
    try {
      const fileSource = fs.readFileSync(
        getRootDirPath ? getRootDirPath(file) : file,
        { encoding: "utf8" }
      );
      switch (type) {
        case "HTML":
          const selector = position.slice(0, -1).join(" ");
          const [attrName] = position.slice(-1);
          return new DOMParser()
            .parseFromString(fileSource, "text/html")
            .querySelector(selector)[attrName];
        case "JSON":
          return position.reduce((p, c) => p[c], JSON.parse(fileSource));
        case "TEXT_REGEX":
          const [regex, index] = position;
          return fileSource.match(new RegExp(regex))[index];
      }
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  };
  const tests = importAllPlugins().map(({ name, execFile, test, address }) => {
    let stringExecFile = "";
    if (typeof execFile !== "string") {
      // EXEC_FILE 動的取得
      const execHintFile = fullPathFiles.find((fpf) =>
        new RegExp(`${execFile.file}$`).test(fpf)
      );
      if (!execHintFile)
        return {
          folderName,
          error: "execFile.file が見つかりません: " + stringExecFile,
        };
      stringExecFile = pickupAddress({ ...execFile, file: execHintFile });
    } else {
      // EXEC_FILE 文字列として取得
      stringExecFile = execFile;
    }
    const execFileFullPath = fullPathFiles.find((fpf) =>
      new RegExp(`${stringExecFile}$`).test(fpf)
    );
    if (!execFileFullPath)
      return {
        folderName,
        error: "execFile が見つかりません: " + stringExecFile,
      };
    const rootDir = path.dirname(execFileFullPath);
    const getRootDirPath = (...paths) =>
      path.join(
        rootDir,
        ...paths.map((p) =>
          p === ":EXEC_FILE" ? path.basename(execFileFullPath) : p
        )
      );
    // バリデーション
    const passIncludes = test.includes.every((file) =>
      fs.existsSync(getRootDirPath(file))
    );
    const passExcludes = test.excludes.every(
      (file) => !fs.existsSync(getRootDirPath(file, getRootDirPath))
    );
    const passAnalyze = test.analyze
      ? test.analyze.every((testcase) => {
          const value = pickupAddress(testcase, getRootDirPath);
          const { method, result } = testcase.expect;
          switch (method) {
            case "IS_TRUTHY":
              return !!value === result;
          }
          return {
            folderName,
            error: "サポートされていないメソッドが指定されました: " + method,
          };
        })
      : true;
    if (!passIncludes || !passExcludes || !passAnalyze)
      return { folderName, error: "ファイル構造が合いません" };
    // 各種データの取得
    /** @type {GameData} */
    const gameData = {
      folderName,
      title: address.title
        ? pickupAddress(address.title, getRootDirPath)
        : undefined,
      alias: "",
      isHTML: /\.html$/.test(stringExecFile),
      type: name,
      updatedAt: new Date().toJSON(),
      screenSize: {
        width: address.width
          ? Number(pickupAddress(address.width, getRootDirPath))
          : undefined,
        height: address.height
          ? Number(pickupAddress(address.height, getRootDirPath))
          : undefined,
      },
      icon: address.icon
        ? pickupAddress(address.icon, getRootDirPath)
        : undefined,
      exec: {
        path: execFileFullPath,
        name: stringExecFile,
      },
      files: fullPathFiles.map((p) =>
        libs.slash(p).replace(new RegExp(`^.*?${folderName}/(.*?$)`), "$1")
      ),
    };
    return gameData;
  });
  return tests;
};

// console.log(111, analyzeGame("game-unity"));
// console.log(111, fs.readdirSync(getGamePath()).map(analyzeGame));

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
