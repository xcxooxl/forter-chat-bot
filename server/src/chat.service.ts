import { Server, Socket } from "socket.io";
import * as http from "http";
import {
  ChatMember,
  MessagePayloads,
  MessageType,
} from "../../shared/message.types";
import { botUser, getRandomUser, getUserByName, mockUsers } from "./users.mock";
import { getAlreadyAnsweredMessage, getUserJoinMessage } from "./bot-phrases";
import { mockMessages } from "./messages.mock";
import { elastic } from "./elastic";

class ChatService {
  io?: Server;
  connectedMembers: Record<string, ChatMember> = {
    ["botKey"]: botUser,
  };
  membersMap: Record<number, ChatMember> = [...mockUsers, botUser].reduce(
    (acc, member) => {
      acc[member.id] = member;
      return acc;
    },
    {} as Record<number, ChatMember>
  );

  async init(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    await elastic.createQuestionIndex();
    this.io.on("connection", this.onNewConnection);
  }

  private getServer(): Server {
    if (this.io) return this.io;
    throw new Error("ChatService was not properly initialized");
  }

  emit = <T extends MessageType>(
    messageType: T,
    payload: MessagePayloads[T],
    socket?: Socket
  ) => {
    const emitter = socket || this.getServer();
    emitter.emit(messageType, {
      messageType,
      payload: {
        ...payload,
        timestamp: new Date().getTime(),
      },
    });
  };

  private onNewConnection = async (socket: Socket) => {
    await this.onUserLogin(socket);
    socket.on(MessageType.QUESTION_ASKED, (payload) =>
      this.onNewQuestion(payload, this.connectedMembers[socket.id])
    );
    socket.on(MessageType.QUESTION_ANSWERED, (payload) =>
      this.onQuestionAnswered(payload, this.connectedMembers[socket.id])
    );
    socket.on("disconnect", this.onDisconnect(socket));
  };

  private onUserLogin = async (socket: Socket) => {
    const fakeAssignedUser = getRandomUser(this.membersMap);
    this.emit(
      MessageType.FAKE_AUTH,
      {
        member: fakeAssignedUser,
      },
      socket
    );

    this.connectedMembers[socket.id] = fakeAssignedUser;
    this.membersMap[fakeAssignedUser.id] = fakeAssignedUser;

    await this.emit(MessageType.MEMBERS_UPDATE, {
      members: this.membersMap,
    });

    this.emit(MessageType.BOT_MESSAGE_SENT, {
      author_id: botUser.id,
      content: getUserJoinMessage(fakeAssignedUser),
    });

    // this.sendMockMessages(socket);
  };

  private async sendMockMessages(socket: Socket) {
    const rossGeler = getUserByName("Ross");
    const rachelGreen = getUserByName("Rachel");

    for (const msg of mockMessages) {
      const question = await this.onNewQuestion(
        {
          content: msg.content,
        },
        rossGeler!,
        socket
      );

      if (question) {
        msg.answers.forEach((answer) =>
          this.onQuestionAnswered(
            {
              content: answer.content,
              id: question.id!,
            },
            rachelGreen!,
            socket
          )
        );
      }
    }
  }

  private onDisconnect = (socket: Socket) => () => {
    delete this.connectedMembers[socket.id];
  };

  private onQuestionAnswered = async (
    payload: MessagePayloads[MessageType.QUESTION_ANSWERED],
    member: ChatMember,
    socket?: Socket
  ) => {
    payload.author_id = member.id;
    await this.emit(MessageType.QUESTION_ANSWERED, payload, socket);
    elastic.storeAnswer(payload);
    //save to elastic..
  };

  private onNewQuestion = async (
    question: MessagePayloads[MessageType.QUESTION_ASKED],
    member: ChatMember,
    socket?: Socket
  ): Promise<MessagePayloads[MessageType.QUESTION_ASKED]> => {
    question.author_id = member.id;
    question.id = await elastic.storeQuestion(question);

    this.emit(MessageType.QUESTION_ASKED, question, socket);
    // bot should not answer mock messages..
    const [firstQuestion] = await elastic.searchQuestion(question);
    if (firstQuestion && firstQuestion._source?.answers?.length) {
      //todo: this is pretty loose logic between questions => answers,
      // should  probably enable the user to use buttons like telegram, to select a resembling question and only then
      // get the answer
      const answers = firstQuestion._source?.answers
        ?.map((answer, index) => `${index + 1}. ${answer.content}`)
        .join("\n");
      this.emit(MessageType.BOT_MESSAGE_SENT, {
        author_id: botUser.id,
        content: `${getAlreadyAnsweredMessage(member)}
        answers: 
        ${answers}`,
      });
    }

    return question;
  };
}

export const chatService = new ChatService();
