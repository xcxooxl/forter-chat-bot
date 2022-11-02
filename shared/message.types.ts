export interface ChatMember {
  id: number;
  name: string;
  profileImg: string;
  isConnected: boolean;
}

export enum MessageType {
  FAKE_AUTH = "FAKE_AUTH",
  // MEMBER_JOIN = "MEMBER_JOIN",
  QUESTION_ASKED = "QUESTION_ASKED",
  QUESTION_ANSWERED = "QUESTION_ANSWERED",
  BOT_MESSAGE_SENT = "BOT_MESSAGE_SENT",
  MEMBERS_UPDATE = "MEMBERS_UPDATE",
}

type TimeStampedPayload<T> = T & { timestamp?: EpochTimeStamp };

export type MessagePayloads = {
  [MessageType.FAKE_AUTH]: TimeStampedPayload<{ member: ChatMember }>;
  [MessageType.MEMBERS_UPDATE]: TimeStampedPayload<{
    members: Record<number, ChatMember>;
  }>;
  [MessageType.QUESTION_ASKED]: TimeStampedPayload<{
    author_id?: number;
    content: string;
    id?: string;
    answers?: Array<{ author_id: number; content: string }>;
  }>;
  [MessageType.QUESTION_ANSWERED]: TimeStampedPayload<{
    author_id?: number;
    id: string;
    content: string;
  }>;
  [MessageType.BOT_MESSAGE_SENT]: TimeStampedPayload<{
    author_id: number;
    content: string;
  }>;
};

export type SocketMessage<T extends keyof MessagePayloads> = {
  messageType: T;
  payload: MessagePayloads[T];
};
