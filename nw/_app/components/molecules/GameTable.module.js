// @ts-check
import { html, Fragment } from "/_app/utils.module.js";

/**
 * @param {{
 * gameList: GameData[]
 * changeScreen: (screenName: string, folderName?: string) => void
 * }} props
 */
export default (props) => html`
  <${Fragment}>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Folder</th>
          <th>Type</th>
          <th>Title</th>
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
                props.changeScreen("details", g.folderName);
              }}"
            >
              <th>${index}</th>
              <td>${g.folderName}</td>
              <td>${g.type}</td>
              <td>${g.alias || g.title}</td>
              <td>
                ${g.playedAt ? new Date(g.playedAt).toLocaleString() : ""}
              </td>
              <td>${new Date(g.updatedAt).toLocaleString()}</td>
            </tr>
          `
        )}
      </tbody>
    </table>
  <//>
`;
