import { html, isDir, Fragment, GAME_DIR } from "/_app/utils.module.js";
const fs = require("fs-extra");

export default ({}) => html`
<${Fragment}>
  <table class="table">
    <thead>
      <tr>
        <th>id</th>
        <th>Folder</th>
        <th>Type</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>
      ${fs
        .readdirSync(GAME_DIR)
        .filter((folderName) => isDir(`${GAME_DIR}/${folderName}`))
        .map(
          (folderName, index) => html`<tr>
            <th>${index}</th>
            <td>${folderName}</td>
            <td>???</td>
            <td>${folderName}</td>
          </tr>`
        )}
    </tbody>
  </table>
</${Fragment}>
`;
