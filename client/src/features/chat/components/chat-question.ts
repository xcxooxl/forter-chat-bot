import { LitElement, html, customElement, css, property } from "lit-element";
import chatService from "../../chat.service";
import { appTheme } from "../../../config/theme";
import "./chat-message";
import {
  MessagePayloads,
  MessageType,
} from "../../../../../shared/message.types";
const style = css`
  :host {
    width: 100%;
  }

  :host > .wrapper {
    display: flex;
    align-items: center;
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
    border-radius: 12px;
    user-select: text;
    flex-direction: column;
    padding: 6px 10px 6px 10px;
  }

  .question {
    background-color: var(--question-bg-color);
  }

  .answer-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }

  .question-header {
    font-size: ${appTheme.typography.fontSizes.S}px;
    font-weight: ${appTheme.typography.fontWeights.MEDIUM};
  }

  .question-selected {
    opacity: 0.6;
  }

  .question-content {
    font-size: ${appTheme.typography.fontSizes.M}px;
    font-weight: ${appTheme.typography.fontWeights.SEMI_BOLD};
  }

  :host(.my-message) {
    align-self: flex-end;
  }
`;
@customElement("chat-question")
export class ChatQuestion extends LitElement {
  @property()
  message?: MessagePayloads[MessageType.QUESTION_ASKED];

  @property()
  isSelected: boolean = false;

  isMe: boolean = false;
  static styles = [style];

  constructor() {
    super();
  }

  questionSelected() {
    const event = new CustomEvent("question-selected", {
      detail: {
        isSelected: !this.isSelected,
        message: !this.isSelected ? this.message : null,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    this.isMe = this?.message?.author_id === chatService.getId();
    let user = chatService.getUserById(this.message?.author_id!);
    const content = user
      ? html`<div class="question-header">
            ${this.isMe ? "You" : user.name} asked:
          </div>
          <div class="question-content">${this?.message?.content}</div>`
      : html`<div>error</div>`;

    const answers = this.message?.answers?.map(
      (answer) => html`<chat-message .message=${answer}></chat-message>`
    );

    return html`<div
      class="wrapper question ${this.isSelected ? "question-selected" : ""}"
      @click=${this.questionSelected}
    >
      ${content}
      <div class="answer-list">${answers}</div>
    </div>`;
  }
}
