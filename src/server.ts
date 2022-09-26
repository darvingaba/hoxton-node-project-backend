import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const app = express()
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

const port = 3456


app.get("/users",async(req,res)=>{})

app.post("/sign-up",async(req,res)=>{
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password),
      },
    });
        res.send(user)
})

app.post("/sign-in",async(req,res)=>{})

app.listen(port,()=>{
    console.log("server up")
})