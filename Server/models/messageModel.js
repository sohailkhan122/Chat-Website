const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    receiverId: {
        type: String,
    },
    text: {
        type: String,
    },
    type: {
        type: String,
    },
    image: {
        data: {
            type: Buffer,
            default: null,
        },
        contentType: {
            type: String,
            default: null,
        },
    },
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);


module.exports = Message;
