const express = require("express");
const { conversation, getConversation } = require("../Controller/chatController");


const Router = express.Router();

Router.post('/conversation', conversation);
Router.post('/getConversation', getConversation);

module.exports = Router;