import { Client } from "@elastic/elasticsearch";
import { MessagePayloads, MessageType } from "../../shared/message.types";
import { SearchHit } from "@elastic/elasticsearch/lib/api/types";

const QUESTIONS_INDEX = "quaa3t1ions3";

const client = new Client({
  node: "https://localhost:9200",
  auth: { username: "elastic", password: "123456" }, // should be env secret.
});

export const elastic = {
  createQuestionIndex: async () => {
    const questionsIndexExists = await client.indices.exists({
      index: QUESTIONS_INDEX,
    });

    if (questionsIndexExists) {
      await client.indices.delete({ index: QUESTIONS_INDEX });
    }
    await client.indices.create({
      index: QUESTIONS_INDEX,
      mappings: {
        properties: {
          author_id: { type: "integer" },
          content: { type: "text" },
          answers: {
            type: "object",
            properties: {
              author_id: { type: "integer" },
              content: { type: "text" },
            },
          },
        },
      },
    });
  },
  storeQuestion: async (
    payload: MessagePayloads[MessageType.QUESTION_ASKED]
  ) => {
    const storedQuestion = await client.index({
      index: QUESTIONS_INDEX,
      document: {
        content: payload.content,
        author_id: payload?.author_id,
        answers: [],
      },
    });

    return storedQuestion._id;
  },
  storeAnswer: async (
    payload: MessagePayloads[MessageType.QUESTION_ANSWERED]
  ) => {
    const answer = await client.update({
      index: QUESTIONS_INDEX,
      id: payload.id,
      retry_on_conflict: 3,
      script: {
        lang: "painless",
        source: `
        ctx._source.answers.add(params.answer)
          `,
        params: {
          answer: {
            content: payload.content,
            author_id: payload.author_id,
          },
        },
      },
    });
    return answer._id;
  },
  searchQuestion: async (
    payload: MessagePayloads[MessageType.QUESTION_ASKED]
  ) => {
    const results = await client.search({
      index: QUESTIONS_INDEX,
      query: {
        bool: {
          must: [
            {
              match_phrase: { content: payload.content },
            },
          ],
        },
      },
    });
    const hits =
      (results?.hits?.hits as SearchHit<
        MessagePayloads[MessageType.QUESTION_ASKED]
      >[]) || [];
    hits.sort(
      (a, b) => b._source?.answers?.length! - a._source?.answers?.length!
    );
    return hits;
  },
};
