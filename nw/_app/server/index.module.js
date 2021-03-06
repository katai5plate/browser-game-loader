const http = require("http");
const fs = require("fs");
const path = require("path");
import { getMetaPath } from "/_app/utils.module.js";

(() => {
  const SETTINGS_JSON = JSON.parse(
    fs.readFileSync(getMetaPath("settings.json"), { encoding: "utf8" })
  );
  const PORT = SETTINGS_JSON.port;
  const URL = "http://localhost:" + PORT + "/";
  const server = http.createServer(function (request, response) {
    console.log("request: ", request.url);
    let filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };
    const contentType = mimeTypes[extname] || "application/octet-stream";
    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          response.writeHead(404, { "Content-Type": "text/html" });
          response.end("404");
        } else {
          response.writeHead(500);
          response.end("500: " + error.code, "utf-8");
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  });
  server.on("error", (error) => {
    console.warn("Port is already open: " + PORT + "\n", error);
  });
  server.listen(PORT, () => {
    console.log("Server running at: " + URL);
  });
})();
