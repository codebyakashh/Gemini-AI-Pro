console.log("SERVER FILE LOADED");
console.log("AKASH VERSION 1006 - TEXT CHAT ONLY");

import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import ChatSession from "./models/Chat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error("CORS blocked"));
    }
  },
  credentials:true
}));

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({limit:"10mb", extended:true}));

connectDB();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


// GET ALL CHATS
app.get("/api/chats", async(req,res)=>{
  try{
    const chats = await ChatSession.find()
      .sort({updatedAt:-1});

    res.json(chats);

  }catch(error){
    res.status(500).json({
      error:error.message
    });
  }
});


// CREATE NEW CHAT
app.post("/api/chats/new", async(req,res)=>{
  try{

    const chat = new ChatSession({
      title:"New Conversation",
      messages:[]
    });

    await chat.save();

    res.status(201).json(chat);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }
});


// DELETE CHAT
app.delete("/api/chats/:id", async(req,res)=>{
  try{

    await ChatSession.findByIdAndDelete(req.params.id);

    res.json({
      success:true
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }
});


// SEND MESSAGE
app.post("/api/chats/:id/message", async(req,res)=>{

  try{

    const {id}=req.params;
    const {message}=req.body;

    if(!message){
      return res.status(400).json({
        error:"Message missing"
      });
    }


    const session = await ChatSession.findById(id);


    if(!session){
      return res.status(404).json({
        error:"Chat not found"
      });
    }


    session.messages.push({
      sender:"user",
      text:message
    });


    if(session.title==="New Conversation"){
      session.title = message.substring(0,40);
    }


    const model = genAI.getGenerativeModel({
      model:"gemini-2.5-flash"
    });


    const result = await model.generateContent(message);


    const botReply = result.response.text();


    session.messages.push({
      sender:"model",
      text:botReply
    });


    await session.save();


    res.json(session);


  }catch(error){

    console.log("🔥 ERROR:",error);

    res.status(500).json({
      error:error.message
    });

  }

});



const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
  console.log(`🚀 SERVER RUNNING ${PORT}`);
});