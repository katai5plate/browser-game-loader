const extract = require("extract-zip");
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
  await extract(DOWNLOAD_DIR + FILENAME, { dir: DEST_DIR_PATH });
  console.log("COPYING...");
  const INSIDE_DIR_PATH = `${DEST_DIR_PATH}/${
    fs.readdirSync(DEST_DIR_PATH)[0]
  }`;
  const COPY_TEMP_PATH = DOWNLOAD_DIR + "_temp";
  fs.moveSync(INSIDE_DIR_PATH, COPY_TEMP_PATH, { overwrite: true });
  fs.removeSync(DEST_DIR_PATH);
  fs.renameSync(COPY_TEMP_PATH, DOWNLOAD_DIR + DEST_DIR_NAME + "/");
  console.log("COMPLETE " + DEST_DIR_PATH);
})();
