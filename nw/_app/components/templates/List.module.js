// @ts-check
import { html, Fragment } from "/_app/utils.module.js";
import GameTable from "/_app/components/molecules/GameTable.module.js";

export default ({ changeScreen, gameList }) => {
  return html`
    <${Fragment}>
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
