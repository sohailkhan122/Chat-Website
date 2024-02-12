const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const message = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, text, type, image } = req.body;
        console.log(req.body)

        const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            text,
            type,
            image: image
                ? {
                    data: Buffer.from(image, 'base64'),
                    contentType: req.headers['content-type'] || 'application/octet-stream',
                }
                : null,
        });

        await newMessage.save();
        await Chat.findByIdAndUpdate(conversationId, { message: text });

        return res.status(200).json({ success: true, message: 'Message has been sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports = { message, getMessages };
