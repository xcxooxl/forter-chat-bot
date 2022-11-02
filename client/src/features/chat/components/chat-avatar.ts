import { LitElement, html, customElement, css } from "lit-element";
import { v4 as uuidv4 } from "uuid";
import { appTheme } from "../../../config/theme";

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    color: var(--secondary-text-color, "grey");
  }

  :host > img {
    height: 42px;
    width: 42px;
  }

  .group-wrapper {
    padding-left: 18px;
  }

  .group-name {
    font-weight: ${appTheme.typography.fontWeights.MEDIUM};
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--primary-text);
  }
`;

@customElement("chat-avatar")
export class ChatAvatar extends LitElement {
  static styles = [style];
  img: string;
  chatName: string;
  // static get properties() {
  //   return {
  //     name: { type: String },
  //   };
  // }

  constructor() {
    super();
    this.img = `https://i.pravatar.cc/150?u=${uuidv4()}`;
    this.chatName = "השקעות קריפטו ונדלן";
  }

  render() {
    return html`
      <img class="avatar-photo" src="${this.img}" />
      <div class="group-wrapper">
        <span class="group-name">${this.chatName}</span>
      </div>
    `;
  }
}
