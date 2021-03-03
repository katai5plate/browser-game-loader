// 対象以外のファイルを削除する

const fs = require("fs-extra");

const [, , DIR_NAME, SAVE_FILE_LIST] = process.argv;

const saveFileList = SAVE_FILE_LIST.split(",");
const DIR_PATH = `${process.cwd().replace(/\\/g, "/")}/${DIR_NAME}/`;

console.log("DELETE OTHER THAN:", saveFileList);
console.log("IN: " + DIR_PATH + "*\n");

fs.readdirSync(DIR_PATH)
  .filter((name) => !saveFileList.includes(name))
  .forEach((name) => {
    const path = `${DIR_PATH}${name}`;
    try {
      fs.removeSync(path);
      console.log("DELETED " + name);
    } catch (error) {
      console.log("DELETE FAILED! " + name);
      throw new Error(error);
    }
  });
