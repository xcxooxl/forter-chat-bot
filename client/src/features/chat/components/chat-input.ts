import { css, customElement, html, LitElement, property } from "lit-element";
import { appTheme } from "../../../config/theme";
import chatService from "../../chat.service";
import { ChatInputSentEvent } from "../index";
import {
  MessagePayloads,
  MessageType,
} from "../../../../../shared/message.types";

const style = css`
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: inherit;
    background-color: white;
    font-weight: ${appTheme.typography.fontWeights.MEDIUM};
    min-width: 56px;
    user-select: text;
    border-radius: 12px;
    margin-top: 12px;
    margin-bottom: 20px;
    padding: 6px 10px 6px 11px;
  }

  .chat-input {
    border: none;
    outline: none;
  }
`;
@customElement("chat-input")
export class ChatInput extends LitElement {
  static styles = [style];

  @property()
  inputText: string = "";

  @property()
  question?: MessagePayloads[MessageType.QUESTION_ASKED];

  constructor() {
    super();
  }

  onKeyUp(e: KeyboardEvent) {
    const text = (e.target as HTMLInputElement).value;
    if (e.key == "Enter" && text.length > 0) {
      const event: ChatInputSentEvent = new CustomEvent("chat-input-sent", {
        detail: {
          text: (e.target as HTMLInputElement).value,
          question: this.question,
        },
      });
      this.dispatchEvent(event);
      (e.target as HTMLInputElement).value = "";
    }
  }

  getPlaceholder() {
    return this.question && this.question.author_id
      ? `Answering ${chatService.getUserById(this.question.author_id)?.name}...`
      : `What is your question? How...`;
  }

  render() {
    return html`<div class="wrapper">
      <input
        type="text"
        class="chat-input"
        @keyup=${this.onKeyUp}
        placeholder=${this.getPlaceholder()}
      />
    </div>`;
  }
}
