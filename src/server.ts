import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const app = express()
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

const port = 3456


app.get("/users",async(req,res)=>{
  const users = await prisma.user.findMany()
  res.send(users)
})

app.post("/sign-up",async(req,res)=>{
    try{
      const inputedEmail = await prisma.user.findUnique({where:{email:req.body.email}})
      if(inputedEmail){
        res.status(404).send({error:"Account exists!"})
      }else{
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password),
          },
        });
        res.send(user);
      }
      
    }catch(error){
      //@ts-ignore
      res.status(404).send({error:error.message})
    }
})

app.post("/sign-in",async(req,res)=>{
  const user = await prisma.user.findUnique({
    where:{
      email:req.body.email
    }})
    if(user && bcrypt.compareSync(req.body.password,user.password)){
      res.send(user)
    }else{
      res.status(404).send({error:"Invalid email/password!"})
    }
})

app.listen(port,()=>{
    console.log("server up")
})