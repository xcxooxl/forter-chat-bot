import { LitElement, html, customElement, css } from "lit-element";
import { v4 as uuidv4 } from "uuid";
import { appTheme } from "../../../config/theme";

export const headerHeight = 50;
const style = css`
  :host {
    display: flex;
    flex-direction: row;
    color: var(--secondary-text-color, "grey");
    width: 100%;
    height: ${headerHeight}px;
  }

  :host > img {
    height: ${headerHeight}px;
    width: ${headerHeight}px;
  }

  .group-wrapper {
    padding-left: 18px;
    display: flex;
    align-items: center;
  }

  .group-name {
    font-weight: ${appTheme.typography.fontWeights.MEDIUM};
    user-select: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--primary-text);
  }
`;

@customElement("chat-header")
export class ChatHeader extends LitElement {
  static styles = [style];
  img: string;
  chatName: string;

  constructor() {
    super();
    this.img = `https://i.pravatar.cc/150?u=${uuidv4()}`;
    this.chatName = "Q&A Forter";
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
