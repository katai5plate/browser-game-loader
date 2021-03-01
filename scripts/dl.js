const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Progress = require("progress");

const [, , URL, SAVE_NAME] = process.argv;

(async () => {
  console.log("CONNECTING... " + URL);
  const { data, headers } = await axios({
    url: URL,
    method: "GET",
    responseType: "stream",
  });
  const contentLength = headers["content-length"];
  console.log("DOWNLOADING...");
  const hud = new Progress("-> [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: contentLength | 0,
  });
  const fileName = SAVE_NAME || path.parse(URL).base;
  data.on("data", ({ length }) => hud.tick(length));
  data.on("end", () => console.log("DONE " + fileName));
  data.pipe(fs.createWriteStream(`./download/${fileName}`));
})();
