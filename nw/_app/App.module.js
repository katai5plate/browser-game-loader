// @ts-check
import { html } from "/_app/utils.module.js";
import Router from "/_app/components/pages/Router.module.js";

export default () => {
  return html`
    <div>
      <${Router} />
    </div>
  `;
};
