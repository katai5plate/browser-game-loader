// @ts-check
import { html, Fragment, INIT_MESSAGES } from "/_app/utils.module.js";

/**
 * @param {{
 * messages: string[]
 * }} props
 */
export default (props) => {
  return html`
    <${Fragment}>
      ${props.messages.map((message, i) =>
        i === 0 ? html`<h3>${message}</h3>` : html`<p>${message}</p>`
      )}
    <//>
  `;
};
