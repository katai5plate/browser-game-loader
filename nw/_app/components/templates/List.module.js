// @ts-check
import { html, Fragment, mockGameData } from "/_app/utils.module.js";
import GameTable from "/_app/components/molecules/GameTable.module.js";

export default () => html`
  <${Fragment}>
    <${GameTable}
      ...${(() => {
        /** @type {GetProps<typeof GameTable>} */
        const _props = {
          gameList: [mockGameData],
        };
        return _props;
      })()}
    />
  <//>
`;
