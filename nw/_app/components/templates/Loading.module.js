// @ts-check
import {
  html,
  Fragment,
  useState,
  useEffect,
  getServerUrl,
  INIT_MESSAGES,
} from "/_app/utils.module.js";

/**
 * @param {{
 * changeScreen: (screenName: string) => void
 * messages: string[]
 * }} props
 */
export default (props) => {
  const [messages, setMessages] = useState(INIT_MESSAGES.INIT);
  let isOK = false;
  useEffect(async () => {
    if (isOK) return;
    setMessages(INIT_MESSAGES.FETCH_CHECK_SERVER);
    const FAIL_SAFE = 60;
    for (let trialCount = 0; trialCount < FAIL_SAFE; trialCount++) {
      try {
        const response = await (
          await fetch(getServerUrl("_meta", "check.json"))
        ).json();
        console.log("check:", response);
        if (response.result === true) {
          isOK = true;
          break;
        }
      } catch (error) {
        console.warn(error);
      }
      await new Promise((r) => setTimeout(r, 1000));
      trialCount++;
    }
    if (!isOK) return setMessages(INIT_MESSAGES.ERROR);
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
