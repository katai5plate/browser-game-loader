// @ts-check
import {
  html,
  Fragment,
  createAllGameDataFile,
  reload,
} from "/_app/utils.module.js";
import GameTable from "/_app/components/molecules/GameTable.module.js";

export default ({ changeScreen, gameList }) => {
  return html`
    <${Fragment}>
      <p>
        <input
          type="button"
          class="button is-small"
          value="全ゲームフォルダのデータを作り直す"
          onclick=${() => {
            if (
              confirm(
                "ゲームの表示名の入力データ以外は上書きされます。壊れている場合は全て上書きされます。"
              )
            ) {
              if (confirm("後悔しませんね？")) {
                createAllGameDataFile(true);
                reload();
              }
            }
          }}
        />
      </p>
      <${GameTable}
        ...${(() => {
          /** @type {GetProps<typeof GameTable>} */
          const _props = { gameList, changeScreen };
          return _props;
        })()}
      />
    <//>
  `;
};
