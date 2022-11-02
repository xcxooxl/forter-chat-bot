//@ts-ignore
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {
  ChatMember,
  MessagePayloads,
  MessageType,
} from "../../../shared/message.types";

type MessageHandlerCallback<prop extends MessageType> = (
  payload: MessagePayloads[prop]
) => void;
type ChatEvents = {
  [prop in MessageType]: Array<MessageHandlerCallback<prop>>;
};

class ChatService {
  events: ChatEvents = {
    [MessageType.FAKE_AUTH]: [],
    [MessageType.MEMBERS_UPDATE]: [],
    [MessageType.QUESTION_ASKED]: [],
    [MessageType.QUESTION_ANSWERED]: [],
    [MessageType.BOT_MESSAGE_SENT]: [],
  };
  socket: any = null;
  members: Record<number, ChatMember> = {};

  getId(): number {
    return 1;
  }

  sendMessage<T extends MessageType>(
    eventType: T,
    payload: MessagePayloads[T]
  ) {
    this.socket.emit(eventType, payload);
  }

  getUserById(author_id: number): ChatMember | void {
    if (this.members[author_id]) return this.members[author_id];
  }

  addMessageHandler<T extends MessageType>(
    event: T,
    callback: MessageHandlerCallback<T>
  ) {
    this.events[event].push(callback);

    return () => {
      this.events[event].filter((cb) => cb !== callback);
    };
  }

  onMessage<T extends MessageType>(msgType: T, payload: MessagePayloads[T]) {
    if (msgType === MessageType.MEMBERS_UPDATE) {
      this.members = (payload as MessagePayloads["MEMBERS_UPDATE"]).members;
    }
    if (this?.events?.[msgType]) {
      this.events[msgType].forEach((callback: any) => callback(payload));
    }
  }

  connect() {
    this.socket = io("http://localhost:3000");
    //@ts-ignore
    Object.values(MessageType).forEach((eventType) =>
      this.socket.on(
        eventType,
        (data: { payload: MessagePayloads[typeof eventType] }) => {
          this.onMessage(eventType, data.payload);
        }
      )
    );
  }
}

export default new ChatService();
