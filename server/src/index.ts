import express from "express";
import httpServer from "http";
import cors from "cors";
import { chatService } from "./chat.service";

const app = express();
//@ts-ignore
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(cors());
const http = httpServer.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});

chatService.init(http);

http.listen(3000, () => {
  console.log("listening on *:3000");
});
