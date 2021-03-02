const Zip = require("adm-zip");
const fs = require("fs-extra");
const path = require("path");

const [, , FILENAME, SAVE_DIR_NAME] = process.argv;

(async () => {
  console.log("UNZIP... " + FILENAME);
  const DOWNLOAD_DIR = process.cwd().replace(/\\/g, "/") + "/download/";
  const DEST_DIR_NAME = SAVE_DIR_NAME
    ? SAVE_DIR_NAME
    : path.parse(FILENAME).name;
  const DEST_DIR_PATH = DOWNLOAD_DIR + DEST_DIR_NAME;
  // 解凍
  const zip = new Zip(DOWNLOAD_DIR + FILENAME);
  await new Promise((resolve, reject) =>
    zip.extractAllToAsync(DEST_DIR_PATH, true, (e) =>
      e ? reject(e) : resolve()
    )
  );
  console.log("COPYING...");
  const INSIDE_DIR_PATH = `${DEST_DIR_PATH}/${
    fs.readdirSync(DEST_DIR_PATH)[0]
  }`;
  const COPY_TEMP_PATH = DOWNLOAD_DIR + "_temp";
  // 解凍すると 指定名/元々のzip名/* という感じになるので、
  // 一時フォルダに移してから元のフォルダを削除する
  fs.moveSync(INSIDE_DIR_PATH, COPY_TEMP_PATH, { overwrite: true });
  fs.removeSync(DEST_DIR_PATH);
  fs.renameSync(COPY_TEMP_PATH, DOWNLOAD_DIR + DEST_DIR_NAME + "/");
  console.log("COMPLETE " + DEST_DIR_PATH);
})();
