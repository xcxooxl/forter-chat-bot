import { v4 as uuidv4 } from "uuid";
import { css, customElement, html, LitElement, property } from "lit-element";
import "./chat-question";
import { headerHeight } from "./chat-header";
import chatService from "../../chat.service";
import {
  MessagePayloads,
  MessageType,
} from "../../../../../shared/message.types";
import { repeat } from "lit-html/directives/repeat.js";
import { createRef, ref, Ref } from "lit-html/directives/ref.js";

const style = css`
  .wrapper {
    background-color: var(--light-grey-bg);
    height: calc(100vh - ${headerHeight}px - 70px);
    flex-direction: column;
    color: var(--primary-text-color);
    user-select: none;
    display: flex;
    row-gap: 8px;
    align-items: flex-start;
    padding: 10px 10px 0;
    overflow: auto;
  }
`;

export type QuestionSelectedEvent = CustomEvent<{
  isSelected: boolean;
  message: MessagePayloads[MessageType.QUESTION_ASKED];
}>;

@customElement("chat-message-list")
export class ChatMessageList extends LitElement {
  messageListRef: Ref<HTMLInputElement> = createRef();

  @property()
  messages: Array<MessagePayloads[MessageType.QUESTION_ASKED]> = [];

  @property()
  selectedMsg?: MessagePayloads[MessageType.QUESTION_ASKED];

  registeredEvents: Partial<
    Record<MessageType, ReturnType<typeof chatService.addMessageHandler>>
  > = {};

  static styles = [style];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.registeredEvents[MessageType.BOT_MESSAGE_SENT] =
      chatService.addMessageHandler(MessageType.BOT_MESSAGE_SENT, (payload) => {
        const botMessage = {
          id: uuidv4(), //todo: move this to server..
          author_id: payload.author_id,
          content: payload.content,
          timestamp: payload.timestamp || new Date().getTime(),
          answers: [],
        };
        this.messages.push(botMessage);
        this.updateMessageList();
      });

    chatService.addMessageHandler(
      MessageType.QUESTION_ASKED,
      async (payload) => {
        const question = {
          id: payload.id!,
          author_id: payload?.author_id!,
          content: payload.content,
          timestamp: payload.timestamp!,
          answers: [],
        };
        this.messages.push(question);
        this.updateMessageList(true);
      }
    );

    chatService.addMessageHandler(
      MessageType.QUESTION_ANSWERED,
      async (payload) => {
        const question = this.messages.find((msg) => msg.id === payload.id);
        if (question) {
          question?.answers?.push({
            content: payload.content,
            author_id: payload?.author_id!,
          });
          question.timestamp = payload.timestamp!;
          const isLastQuestion =
            question ===
            //@ts-ignore
            this.messages.findLast(
              (msg: MessagePayloads[MessageType.QUESTION_ASKED]) =>
                msg.author_id &&
                chatService.getUserById(msg.author_id)?.name !== "Bot"
            );
          this.updateMessageList(isLastQuestion);
        }
      }
    );

    chatService.connect();
  }

  private async updateMessageList(shouldScroll?: boolean) {
    this.requestUpdate();
    await this.updateComplete;
    if (this.messageListRef?.value && shouldScroll) {
      const lastQuestion = this?.shadowRoot?.querySelector(
        "chat-question:last-of-type"
      );
      const lastAnswer = lastQuestion?.shadowRoot?.querySelector(
        "chat-message:last-of-type"
      );
      const element = lastAnswer || lastQuestion;
      if (lastAnswer) {
        //@ts-ignore
        await lastAnswer.updateComplete;
      }
      element?.shadowRoot?.firstElementChild?.scrollIntoView();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Object.values(this.registeredEvents).forEach((callback) => callback());
  }

  onQuestionSelected(e: QuestionSelectedEvent) {
    this.selectedMsg = e?.detail?.message;
    const event = new CustomEvent("question-selected", {
      detail: { ...e.detail },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`<div class="wrapper" ${ref(this.messageListRef)}>
      ${repeat(
        this.messages,
        (message) => {
          return `${message.id}_${message?.answers?.length}`;
        },
        (message, index) => {
          const isBot =
            chatService.getUserById(message?.author_id!)?.name === "Bot";

          if (!isBot)
            return html`<chat-question
              @question-selected=${this.onQuestionSelected}
              .isSelected=${message.id == this?.selectedMsg?.id}
              .message=${message}
              class="${message.author_id == chatService.getId()
                ? "my-message"
                : ""}"
            ></chat-question>`;

          return html`<chat-message .message=${message}></chat-message>`;
        }
      )}
    </div>`;
  }
}
