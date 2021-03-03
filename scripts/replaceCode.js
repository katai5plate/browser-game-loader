const fs = require("fs-extra");

const [, , FILENAME, A, B] = process.argv;

(async () => {
  const code = fs.readFileSync(FILENAME, { encoding: "utf8" });
  console.log(A, new RegExp(A, "g"), B);
  fs.writeFileSync(FILENAME, code.replace(new RegExp(A, "g"), B));
})();
