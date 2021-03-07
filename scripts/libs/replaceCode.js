const fs = require("fs-extra");

module.exports = (fileName, a, b) => {
  const code = fs.readFileSync(fileName, { encoding: "utf8" });
  console.log(a, new RegExp(a, "g"), b);
  fs.writeFileSync(fileName, code.replace(new RegExp(a, "g"), b));
};
