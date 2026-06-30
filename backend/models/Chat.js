import mongoose from "mongoose";


// Message Schema
const MessageSchema = new mongoose.Schema({

  sender: {
    type: String,
    required: true,
    enum: ["user", "model"]
  },


  text: {
    type: String,
    required: true
  },


  createdAt: {
    type: Date,
    default: Date.now
  }

});



// Chat Session Schema
const ChatSessionSchema = new mongoose.Schema(

  {
    title: {
      type: String,
      default: "New Conversation",
      trim: true
    },


    messages: [MessageSchema]

  },


  {
    timestamps: true
  }

);



// Text Search Index
ChatSessionSchema.index(

  {
    title: "text",
    "messages.text": "text"
  },

  {
    weights: {
      title: 3,
      "messages.text": 1
    }
  }

);



const ChatSession =
  mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);



export default ChatSession;