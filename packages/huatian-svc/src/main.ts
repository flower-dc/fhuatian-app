import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { AccountContent } from "./content/AccountContent";
import { Token } from "./dao/Token";
import { ChatContent } from "./content/ChatContent";
import { Message } from "@huatian/model";

const app = express();
app.use(cookieParser());
app.use(express.json());

// app.use((req, res, next) => {
//   res.set({
//     "Access-Control-Allow-Credentials": true,
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
//     "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
//     "Content-Type": "application/json; charset=utf-8",
//   });
//   next();
// });

type LoggedInResquest = Request & { uid: number };

async function sendStdResponse<T>(res: Response, f: T): Promise<void>;
async function sendStdResponse(
  res: Response,
  f: Promise<unknown>
): Promise<void>;
async function sendStdResponse(
  res: Response,
  f: () => Promise<unknown>
): Promise<void>;
async function sendStdResponse(res: Response, f: unknown): Promise<void> {
  try {
    let data = typeof f === "function" ? f() : f;
    if (data instanceof Promise) {
      data = await data;
    }
    res.send({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.toString(),
    });
  }
}

const _token = (
  req: Request & { uid: number },
  res: Response,
  next: NextFunction
) => {
  const tokenHash = req.cookies["x-token"] as string;
  const token = Token.getInstance();
  const tokenObj = token.getToken(tokenHash);
  if (tokenObj === null) {
    res.status(401).send({ success: false });
    return;
  }
  req.uid = tokenObj.uid;
  next();
};

app.post("/foo", _token, (req: Request & { uid: number }, res) => {
  res.send({ uid: req.uid });
});

app.post("/token", async (req, res) => {
  const { uname, upwd } = req.body;
  const account = AccountContent.getInstance();
  const user = await account.verify(uname, upwd);
  const uid = user.getId();
  const token = Token.getInstance();
  const tokenObject = token.refreshCreate(uid);
  res.cookie("x-token", tokenObject.token);
  sendStdResponse(res, "ok");
});

app.post("/message", _token, (req: LoggedInResquest, res) => {
  const uid = req.uid;
  const chatContent = ChatContent.getInstance();
  console.log("================", req.body);
  sendStdResponse(res, async () => {
    return await chatContent.send(uid, req.body as Message);
  });
});

app.get("/message", _token, (req: LoggedInResquest, res) => {
  const uid = req.uid;
  const lastId = parseInt(req.query.last_id as string) || 0;

  sendStdResponse(res, () => {
    return ChatContent.getInstance().read(uid, lastId);
  });
});

app.listen(6001, () => {
  console.log("listen at 6001");
});
