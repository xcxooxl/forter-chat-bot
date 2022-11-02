import { v4 as uuidv4 } from "uuid";
import { ChatMember } from "../../shared/message.types";

export const botUser = {
  id: 0,
  name: "Bot",
  profileImg: `https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ae6fe01d-bc24-4af6-aa3d-dddb8a073b07/d9p2s4h-0dfde389-8d75-433d-92ef-c43f1d1548f4.png/v1/fill/w_894,h_894,q_70,strp/bender_icon_by_indomidodorex_d9p2s4h-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcL2FlNmZlMDFkLWJjMjQtNGFmNi1hYTNkLWRkZGI4YTA3M2IwN1wvZDlwMnM0aC0wZGZkZTM4OS04ZDc1LTQzM2QtOTJlZi1jNDNmMWQxNTQ4ZjQucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.1w5Lmq04PKFlittUV51erKGCQtH79yjJyr1ABPjXxmY`,
};

export const mockUsers = [
  {
    id: 1,
    name: "Dudi",
    profileImg: `https://i.pravatar.cc/150?u=${uuidv4()}`,
  },
  {
    id: 2,
    name: "Rachel",
    profileImg: `https://pyxis.nymag.com/v1/imgs/47c/71a/130bf1e557e534b3f2be3351afc2ecf952-17-rachel-green-jewish.rsquare.w700.jpg`,
  },
  {
    id: 3,
    name: "Fibi",
    profileImg: `https://www.looper.com/img/gallery/phoebe-buffays-friends-timeline-explained/l-intro-1621661137.jpg`,
  },
  {
    id: 4,
    name: "Ross",
    profileImg: `https://www.thesun.co.uk/wp-content/uploads/2017/08/nintchdbpict000003441959.jpg`,
  },
];

let lastGeneratedUserId = mockUsers.length;

export const getUserByName = (name: string) => {
  return mockUsers.find((user) => user.name === name);
};

export const getRandomUser = (connectedUsers: Record<number, ChatMember>) => {
  const availableUsers = [...mockUsers].filter(
    (user) => !connectedUsers[user.id]
  );
  let randomIndex = Math.floor(Math.random() * availableUsers.length);
  if (availableUsers[randomIndex]) return availableUsers[randomIndex];

  return {
    id: ++lastGeneratedUserId,
    name: "Anonymous",
    profileImg: `https://i.pravatar.cc/150?u=${uuidv4()}`,
  };
};
