// @ts-check
import {
  html,
  useState,
  useEffect,
  getServerUrl,
  INIT_MESSAGES,
} from "/_app/utils.module.js";
import List from "./components/pages/List.module.js";
import Loading from "./components/pages/Loading.module.js";

export default () => {
  const [messages, setMessages] = useState(INIT_MESSAGES.INIT);
  const [status, setStatus] = useState("loading");

  useEffect(async () => {
    if (status !== "loading") return;
    setMessages(INIT_MESSAGES.FETCH_CHECK_SERVER);
    let trialCount = 0;
    const isFailed = () => {
      const FAIL_SAFE = 60;
      return trialCount >= FAIL_SAFE;
    };
    while (1) {
      try {
        const response = await (
          await fetch(getServerUrl("_meta", "check.json"))
        ).json();
        console.log("check:", response);
        if (response.result === true) break;
      } catch (error) {
        if (isFailed()) break;
        console.warn(error);
      }
      await new Promise((r) => setTimeout(r, 1000));
      trialCount++;
    }
    if (isFailed()) return setMessages(INIT_MESSAGES.ERROR);
    setStatus("list");
  }, []);

  return html`
    <div>
      ${status === "loading"
        ? html`<${Loading}
            ...${(() => {
              /** @type {GetProps<typeof Loading>} */
              const _props = { messages };
              return _props;
            })()}
          />`
        : html`<${List} />`}
    </div>
  `;
};
