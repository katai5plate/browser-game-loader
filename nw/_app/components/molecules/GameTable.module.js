// @ts-check
import { html, isDir, Fragment, GAME_DIR } from "/_app/utils.module.js";

/**
 * @param {{
 * gameList: GameData[]
 * }} props
 */
export default (props) => html`
  <${Fragment}>
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>Folder</th>
          <th>Type</th>
          <th>Title</th>
          <th>Alias</th>
          <th>Played at</th>
          <th>Updated at</th>
        </tr>
      </thead>
      <tbody>
        ${props.gameList.map(
          (g, index) => html`
            <tr
              style="cursor:pointer"
              onclick="${() => {
                const path = [
                  "http://localhost:3000/_games",
                  g.folderName,
                  "index.html",
                ].join("/");
                const win = window.open(path);
                const {
                  bounds: { width, height },
                } = nw.Screen.screens.reduce((a, b) => {
                  const [_a, _b] = [a, b].map(
                    ({ bounds: { width, height } }) => width * height
                  );
                  return _a < _b ? a : b;
                });
                win.resizeTo(width, height);
              }}"
            >
              <th>${index}</th>
              <td>${g.folderName}</td>
              <td>${g.type}</td>
              <td>${g.title}</td>
              <td>${g.alias}</td>
              <td>${new Date(g.playedAt).toLocaleString()}</td>
              <td>${new Date(g.updatedAt).toLocaleString()}</td>
            </tr>
          `
        )}
      </tbody>
    </table>
  <//>
`;
