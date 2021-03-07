// @ts-check
import {
  html,
  Fragment,
  useState,
  useEffect,
  getServerUrl,
  importAllGameDataFile,
} from "/_app/utils.module.js";

/**
 * @param {{
 * changeScreen: (screenName: string) => void
 * setGameList: (gameData: GameData[]) => void
 * messages: string[]
 * }} props
 */
export default (props) => {
  const [messages, setMessages] = useState(["起動準備を開始しています..."]);
  const PHASES = {
    INIT: 0,
    CHECKED_SERVER: 1,
  };
  let phase = PHASES.INIT;
  useEffect(async () => {
    if (phase !== PHASES.INIT) return;
    setMessages([
      "サーバーを起動中...",
      "「Windows セキュリティの重要な警告」が出た場合は、",
      "「アクセスを許可する」をクリックしてください。",
    ]);
    const FAIL_SAFE = 60;
    for (let trialCount = 0; trialCount < FAIL_SAFE; trialCount++) {
      try {
        const response = await (
          await fetch(getServerUrl("_meta", "check.json"))
        ).json();
        console.log("check:", response);
        if (response.result === true) {
          phase = PHASES.CHECKED_SERVER;
          break;
        }
      } catch (error) {
        console.warn(error);
      }
      await new Promise((r) => setTimeout(r, 1000));
      trialCount++;
    }
    if (phase !== PHASES.CHECKED_SERVER)
      return setMessages([
        "エラーが発生したため、起動できませんでした。",
        "再インストールするか、",
        "セキュリティやファイアウォールの設定を見直してください。",
      ]);
    setMessages(["ゲーム情報を取得中..."]);
    try {
      const gameList = importAllGameDataFile();
      props.setGameList(gameList);
    } catch (error) {
      return setMessages([
        "ゲーム情報の取得に失敗しました。",
        "__data.json が一部破損している可能性があります。",
      ]);
    }
    props.changeScreen("list");
  }, []);
  return html`
    <${Fragment}>
      ${messages.map((message, i) =>
        i === 0 ? html`<h3>${message}</h3>` : html`<p>${message}</p>`
      )}
    <//>
  `;
};
