const Chat = require("../models/chatModel");


const conversation = async (req, res) => {
  try {
    const senderId = req.body.senderId
    const receiverId = req.body.receiverId

    const exists = await Chat.findOne({ members: { $all: [receiverId, senderId] } })
    if (exists) {
      return res.status(200).json('Conversation Already Exists');
    }

    const newConversation = new Chat({
      members: [senderId, receiverId]
    })

    newConversation.save();
    return res.status(200).json('Conversation saved successfully');
  }
  catch (error) {
    res.status(500).json(error.message);
  }
};

const getConversation = async (req, res) => {
  try {
    const senderId = req.body.senderId
    const receiverId = req.body.receiverId
    const getConversation = await Chat.findOne({ members: { $all: [receiverId, senderId] } })
    res.status(200).json(getConversation);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = { conversation, getConversation }