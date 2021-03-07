// @ts-check
import { Fragment, html, useState } from "/_app/utils.module.js";
import Loading from "/_app/components/templates/Loading.module.js";
import List from "/_app/components/templates/List.module.js";
import Details from "/_app/components/templates/Details.module.js";

export default () => {
  const [screen, setScreen] = useState("loading");
  const [gameList, setGameList] = useState([]);
  const [detailFolderName, setFolderName] = useState([]);

  const changeScreen = (screenName, folderName = undefined) => {
    console.log(screenName, folderName);
    setScreen(screenName);
    folderName && setFolderName(folderName);
  };

  return html`
    <${Fragment}>
      ${(() => {
        switch (screen) {
          case "loading":
            return html`<${Loading} ...${{ changeScreen, setGameList }} />`;
          case "list":
            return html`<${List} ...${{ changeScreen, gameList }} />`;
          case "details":
            return html`<${Details}
              ...${{ changeScreen, folderName: detailFolderName }}
            />`;
        }
      })()}
    <//>
  `;
};
