import { css, customElement, html, LitElement, property } from "lit-element";
import chatService from "../../chat.service";
import {
  MessagePayloads,
  MessageType,
} from "../../../../../shared/message.types";

const style = css`
  .message-wrapper {
    display: flex;
    align-items: flex-end;
    white-space: pre-line;
  }

  .message-wrapper {
    background-color: var(--message-text-bg-color);
    color: var(--message-text-color);
    padding: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 12px 12px 4px 12px;
  }

  .message-user-image {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    margin-left: 8px;
  }
`;
@customElement("chat-message")
export class ChatMessage extends LitElement {
  static styles = [style];

  @property()
  message?: MessagePayloads[MessageType.QUESTION_ASKED];

  constructor() {
    super();
  }

  render() {
    const author = chatService.getUserById(this.message?.author_id!);
    return html`<div class="message-wrapper">
      <div class="message">${this.message?.content}</div>
      <img src="${author?.profileImg}" class="message-user-image" />
    </div>`;
  }
}
