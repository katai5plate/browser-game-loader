// @ts-check
import {
  html,
  Fragment,
  importGameDataFile,
  updateGameDataFile,
  reload,
  createGameDataFile,
  useState,
  getMonitorMinSize,
  getServerUrl,
  getPath,
} from "/_app/utils.module.js";
const fs = require("fs");
const path = require("path");

export default ({ changeScreen, folderName, setNextReload }) => {
  const data = importGameDataFile(folderName);
  const [viewFile, setViewFile] = useState("");
  const changeViewFile = (filePath) => {
    const fullPath = getPath("_games", filePath);
    console.log(fullPath);
    setViewFile(
      fs.readFileSync(fullPath, {
        encoding: "utf8",
      })
    );
  };
  if (!data) changeScreen("list");
  console.log(data);
  return html`
    <${Fragment}>
      <p>
        <input
          type="button"
          class="button is-info"
          value="戻る"
          onclick=${() => changeScreen("list")}
        />
      </p>
      <hr />
      <p>
        <input
          type="button"
          class="button is-primary is-large"
          value="プレイする"
          onclick=${() => {
            const { width, height } = getMonitorMinSize();
            nw.Window.open(getServerUrl("_games", data.exec.path), {
              width: data?.screenSize?.width || width,
              height: data?.screenSize?.height || height,
              position: "center",
              icon: data.icon,
            });
            updateGameDataFile(folderName, { playedAt: new Date().toJSON() });
            setNextReload(true);
          }}
        />
      </p>
      <hr />
      <p>
        <input
          type="button"
          class="button"
          value="ゲームの表示名を変更する"
          onclick=${() => {
            const alias = prompt(
              "ゲームの表示名（空欄でデフォルトに戻す）",
              data.alias || data.title || ""
            );
            if (alias !== null) {
              updateGameDataFile(folderName, { alias });
              reload();
            }
          }}
        />
        <input
          type="button"
          class="button"
          value="ゲーム情報を更新する"
          onclick=${() => {
            if (
              confirm(
                "ゲームの表示名の入力データ以外は上書きされます。壊れている場合は全て上書きされます。"
              )
            ) {
              createGameDataFile(folderName, true);
              reload();
            }
          }}
        />
      </p>
      <hr />
      <p>ファイルビューワー</p>
      <p class="select">
        <select onchange=${({ target }) => changeViewFile(target.value)}>
          <option value="">ファイルを選択</option>
          ${data.files
            .filter(
              (file) =>
                [".txt", ".md", ".html"].includes(path.parse(file).ext) &&
                path.parse(file).base !== data.exec.name
            )
            .map(
              (file) =>
                html`<option value=${file}>${path.parse(file).base}</option>`
            )}
        </select>
      </p>
      ${viewFile && html`<pre>${viewFile}</pre>`}
    <//>
  `;
};
