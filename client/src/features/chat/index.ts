import { css, customElement, html, LitElement, property } from "lit-element";
import { appTheme } from "../../config/theme";
import "./components/chat-header";
import "./components/chat-message-list";
import "./components/chat-input";
import { QuestionSelectedEvent } from "./components/chat-message-list";
import chatService from "../chat.service";
import { MessagePayloads, MessageType } from "../../../../shared/message.types";

export type ChatInputSentEvent = CustomEvent<{
  text: string;
  question?: MessagePayloads[MessageType.QUESTION_ASKED];
}>;

const rootStyle = css`
  .wrapper {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 30px);
    background-color: var(--chat-background);
    height: 100vh;
  }
`;

@customElement("chat-main")
export class Chat extends LitElement {
  static styles = [appTheme.defaultTheme, appTheme.colors, rootStyle];

  @property()
  selectedMsg?: MessagePayloads[MessageType.QUESTION_ASKED];

  constructor() {
    super();
  }

  onQuestionSelected(e: QuestionSelectedEvent) {
    this.selectedMsg = e?.detail?.message;
  }

  onInputSent(e: ChatInputSentEvent) {
    if (this.selectedMsg && e.detail.question?.id) {
      chatService.sendMessage(MessageType.QUESTION_ANSWERED, {
        content: e.detail.text,
        id: e.detail.question.id,
      });
    } else
      chatService.sendMessage(MessageType.QUESTION_ASKED, {
        content: e.detail.text,
      });
  }

  render() {
    return html`
      <div class="wrapper">
        <chat-header></chat-header>
        <chat-message-list
          @question-selected=${this.onQuestionSelected}
        ></chat-message-list>
        <chat-input
          .question=${this.selectedMsg}
          @chat-input-sent=${this.onInputSent}
        ></chat-input>
      </div>
    `;
  }
}
