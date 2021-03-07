// @ts-check
import { Fragment, html, useState } from "/_app/utils.module.js";
import Loading from "/_app/components/templates/Loading.module.js";
import List from "/_app/components/templates/List.module.js";

export default () => {
  const [screen, changeScreen] = useState("loading");
  const [gameList, setGameList] = useState([]);

  return html`
    <${Fragment}>
      ${(() => {
        switch (screen) {
          case "loading":
            return html`<${Loading} ...${{ changeScreen, setGameList }} />`;
          case "list":
            return html`<${List} ...${{ changeScreen, gameList }} />`;
        }
      })()}
    <//>
  `;
};
