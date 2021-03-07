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

// @ts-expect-error
export const reload = () => chrome.runtime.reload();

export const html = htm.bind(h);

export const getPath = (...paths) =>
  path.join(path.dirname(process.execPath), ...paths);
export const getGamePath = (folderName, ...paths) =>
  getPath("_games", ...(folderName ? [folderName, ...paths] : []));
export const getAllGameFolderPaths = () =>
  fs
    .readdirSync(getPath("_games"))
    .map((p) => path.join(getPath("_games"), p))
    .filter(isDir);
export const getAllGameFolderNames = () =>
  getAllGameFolderPaths().map((p) => path.parse(p).name);
export const getGameDataFilePath = (folderName) =>
  getPath("_games", folderName, "__data.json");
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

/**
 * 2 バイト文字を含んでいてもバックスラッシュをスラッシュ化する
 */
export const toSlash = (pathPhrase) => {
  const { root, dir, name, ext } = path.parse(pathPhrase);
  const encodedPath = path.join(
    root,
    ...dir.replace(root, "").split(/\\|\//g).map(encodeURIComponent),
    encodeURIComponent(name) + encodeURIComponent(ext)
  );
  return decodeURIComponent(libs.slash(encodedPath));
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
  /** @returns {GameData} */
  const createErrorObject = (error) => ({
    folderName,
    error,
    title: folderName,
    alias: "",
    isHTML: false,
    type: "ERROR",
    updatedAt: new Date().toJSON(),
    files: [],
  });
  /** @type {GameData[]} */
  const tests = importAllPlugins().map(({ name, execFile, test, address }) => {
    let stringExecFile = "";
    if (typeof execFile !== "string") {
      // EXEC_FILE 動的取得
      const execHintFile = fullPathFiles.find((fpf) =>
        new RegExp(`${execFile.file}$`).test(fpf)
      );
      if (!execHintFile)
        return createErrorObject(
          "execFile.file が見つかりません: " + stringExecFile
        );
      stringExecFile = pickupAddress({ ...execFile, file: execHintFile });
    } else {
      // EXEC_FILE 文字列として取得
      stringExecFile = execFile;
    }
    const execFileFullPath = fullPathFiles.find((fpf) =>
      new RegExp(`${stringExecFile}$`).test(fpf)
    );
    if (!execFileFullPath)
      return createErrorObject("execFile が見つかりません: " + stringExecFile);
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
          return createErrorObject(
            "サポートされていないメソッドが指定されました: " + method
          );
        })
      : true;
    if (!passIncludes || !passExcludes || !passAnalyze)
      return createErrorObject("ファイル構造が合いません");
    // 各種データの取得
    const fullPathToRelative = (fullPath) => {
      const chromeExtDirName = new DOMParser()
        .parseFromString(`<a href="/" />`, "text/html")
        .querySelector("a").href;
      return toSlash(fullPath)
        .replace(new RegExp(`^.*?(${folderName}/.*?$)`), "$1")
        .replace(chromeExtDirName, "");
    };
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
      screenSize: (() => {
        if (!address.width || !address.height) return undefined;
        const [pickedWidth, pickedHeight] = [
          address.width,
          address.height,
        ].map((a) => pickupAddress(a, getRootDirPath));
        if (!pickedWidth || !pickedHeight) return undefined;
        return {
          width: Number(pickedWidth),
          height: Number(pickedHeight),
        };
      })(),
      icon: (() => {
        if (!address.icon) return undefined;
        const picked = pickupAddress(address.icon, getRootDirPath);
        if (!picked) return undefined;
        return fullPathToRelative(picked);
      })(),
      exec: {
        path: fullPathToRelative(execFileFullPath),
        name: stringExecFile,
      },
      files: fullPathFiles.map(fullPathToRelative),
    };
    return gameData;
  });
  // 通ったテストのうち、一番最後に通ったもの選出
  const result = tests
    .filter((x) => !x.error)
    .map((x, index) => ({ index, ...x }))
    .reduce((a, b) => (a.index > b.index ? a : b));
  const { index, ...rest } = result;
  return rest;
};

export const createGameDataFile = (folderName, overwrite = false) => {
  const analyzedData = analyzeGame(folderName);
  const gameDataFilePath = getGameDataFilePath(folderName);
  const isExist = fs.existsSync(gameDataFilePath);
  if (overwrite && isExist) {
    try {
      fs.writeFileSync(
        gameDataFilePath,
        JSON.stringify({
          ...analyzedData,
          alias: JSON.parse(
            fs.readFileSync(gameDataFilePath, {
              encoding: "utf8",
            })
          ).alias,
        })
      );
      console.log(`UPDATED: ${gameDataFilePath}`);
    } catch (error) {
      console.warn(error);
      fs.writeFileSync(gameDataFilePath, JSON.stringify({ ...analyzedData }));
      console.log(`CREATED: ${gameDataFilePath}`);
    }
  } else if (!isExist) {
    fs.writeFileSync(gameDataFilePath, JSON.stringify({ ...analyzedData }));
    console.log(`CREATED: ${gameDataFilePath}`);
  }
};

export const updateGameDataFile = (folderName, mergeObj) => {
  const analyzedData = analyzeGame(folderName);
  const gameDataFilePath = getGameDataFilePath(folderName);
  const isExist = fs.existsSync(gameDataFilePath);
  if (isExist) {
    fs.writeFileSync(
      gameDataFilePath,
      JSON.stringify({ ...analyzedData, ...mergeObj })
    );
    return console.log(`UPDATED: ${gameDataFilePath}`);
  }
  console.warn("NOT FOUND: " + gameDataFilePath);
};

export const createAllGameDataFile = (overwrite = false) => {
  getAllGameFolderNames().forEach((name) =>
    createGameDataFile(name, overwrite)
  );
};

/**
 * @returns {GameData}
 */
export const importGameDataFile = (folderName) => {
  const gameDataFilePath = getGameDataFilePath(folderName);
  if (!fs.existsSync(gameDataFilePath)) {
    console.warn("データが見つかりません: " + folderName);
    return undefined;
  }
  try {
    return JSON.parse(fs.readFileSync(gameDataFilePath, { encoding: "utf8" }));
  } catch (error) {
    console.warn(error);
    return undefined;
  }
};

/**
 * @returns {GameData[]}
 */
export const importAllGameDataFile = () => {
  return getAllGameFolderNames().reduce((p, name) => {
    const result = importGameDataFile(name);
    if (!result) return p;
    try {
      return [...p, result];
    } catch (error) {
      console.warn(error);
      return p;
    }
  }, []);
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

/**
 * マルチモニターのうち一番小さい画面サイズを取得
 */
export const getMonitorMinSize = () => {
  const { bounds } = nw.Screen.screens.reduce((a, b) => {
    const [_a, _b] = [a, b].map(
      ({ bounds: { width, height } }) => width * height
    );
    return _a < _b ? a : b;
  });
  return bounds;
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
