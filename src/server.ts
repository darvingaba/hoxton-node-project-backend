import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

const port = 3456;

const SECRET = "SECRET";

function getToken(id: number) {
  return jwt.sign({ id: id }, SECRET);
}

async function getCurrentUser(token: string) {
  const data = jwt.verify(token, SECRET);
  //@ts-ignore
  const user = await prisma.user.findUnique({ where: { id: data.id } });
  return user;
}

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { nfts: true } });
  res.send(users);
});

app.post("/sign-up", async (req, res) => {
  try {
    const inputedEmail = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (inputedEmail) {
      res.status(404).send({ error: "Account exists!" });
    } else {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          password: bcrypt.hashSync(req.body.password),
        },
      });
      res.send({ user: user, token: getToken(user.id) });
    }
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: error.message });
  }
});

app.post("/sign-in", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send({ user: user, token: getToken(user.id) });
  } else {
    res.status(404).send({ error: "Invalid email/password!" });
  }
});

app.get("/validate", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const user = await getCurrentUser(req.headers.authorization);
      // @ts-ignore
      res.send({ user, token: getToken(user.id) });
    }
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.get("/nfts", async (req, res) => {
  const nfts = await prisma.nft.findMany({ include: { user: true } });
  res.send(nfts);
});


app.get("/nfts/:id", async (req, res) => {
  const nft = await prisma.nft.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: { user: true },
  });
  res.send(nft);
});

app.patch("/nfts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = Number(req.body.id);
    const updatedNft = await prisma.nft.update({
      where: { id: id },
      data: {
        userId: user,
      },
    });
    res.send(updatedNft);
  } catch (error) {
    // @ts-ignore
    res.status(404).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("server up");
});
