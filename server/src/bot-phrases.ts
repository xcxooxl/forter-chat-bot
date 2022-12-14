import { ChatMember } from "../../shared/message.types";

const joinMessages = [
  "$member just joined the server - glhf!",
  "$member just joined. Everyone, look busy!",
  "$member just joined. Can I get a heal?",
  "$member joined your party.",
  "$member joined. You must construct additional pylons.",
  "Welcome, $member. Stay awhile and listen.",
  "Welcome, $member. We were expecting you ( ͡° ͜ʖ ͡°)",
  "Welcome, $member. We hope you brought pizza.",
  "Welcome $member. Leave your weapons by the door.",
  "A wild $member appeared.",
  "Swoooosh. $member just landed.",
  "Brace yourselves. $member just joined the server.",
  "$member just joined. Hide your bananas.",
  "$member just arrived. Seems OP - please nerf.",
  "$member just slid into the server.",
  "A $member has spawned in the server.",
  "Big $member showed up!",
  "Where’s $member? In the server!",
  "$member hopped into the server. Kangaroo!!",
  "$member just showed up. Hold my beer.",
  "Challenger approaching - $member has appeared!",
  "It's a bird! It's a plane! Nevermind, it's just $member.",
  "It's $member! Praise the sun! [T]/",
  "Never gonna give $member up. Never gonna let $member down.",
  "Ha! $member has joined! You activated my trap card!",
  "Cheers, love! $member's here!",
  "Hey! Listen! $member has joined!",
  "We've been expecting you $member",
  "It's dangerous to go alone, take $member!",
  "$member has joined the server! It's super effective!",
  "Cheers, love! $member is here!",
  "$member is here, as the prophecy foretold.",
  "$member has arrived. Party's over.",
  "Ready player $member",
  "$member is here to kick butt and chew bubblegum. And $member is all out of gum.",
  "Hello. Is it $member you're looking for?",
  "$member has joined. Stay a while and listen!",
  "Roses are red, violets are blue, $member joined this server with you",
];

const alreadyAnsweredMessages = [
  "$member, How ‘bout them apples?",
  "hmm .. are these answers to your satisfactory ..?",
  "Hello..? is this the answer you have been looking for?",
  "Hey $member, how you doing! oh.. you just wanted information..",
  "$member, Don't forget to rank me 5 stars if this is helpful to you",
];

export const getUserJoinMessage = (chatMember: ChatMember) => {
  const randomMsgIndex = Math.floor(Math.random() * joinMessages.length);
  return joinMessages[randomMsgIndex].replaceAll("$member", chatMember.name);
};

export const getAlreadyAnsweredMessage = (chatMember: ChatMember) => {
  const randomMsgIndex = Math.floor(
    Math.random() * alreadyAnsweredMessages.length
  );
  return alreadyAnsweredMessages[randomMsgIndex].replaceAll(
    "$member",
    chatMember.name
  );
};
