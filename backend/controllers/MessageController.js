import expressAsyncHandler from "express-async-handler";
import express from "express"
import Message from "../models/messageModel.js";
import Chat from "../models/ChatModel.js";
import User from "../models/userModel.js";
class MessageController{
    static sendMessage = expressAsyncHandler(async (req, res) => {
        
        const { chatId, content } = req.body;
        
        if (!chatId || !content) {
          res.status(400);
          throw new Error("Invalid data passed into request");
        }

        const newMessage = {
          sender: req.user,
          content: content,
          chat: chatId,
        };

        try {
           let message = await Message.create(newMessage); 
           message = await Message.populate(message, {
             path: "sender",
             select: "name pic",
               });
          message = await Message.populate(message, { path: "chat" });

           message = await User.populate(message, {
             path: "chat.users",
             select: "name pic email",
           });

           await Chat.findByIdAndUpdate(req.body.chatId, {
             latestMessage: message,
           });

           res.json(message);

        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    })

    static allMessage = expressAsyncHandler(async(req,res) => {
        try {
            const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "pic name email").populate("chat")
           res.json(messages);
        } catch (error) {
            res.json(400);
            throw new Error(error.message)
        }
    })
}

export default MessageController