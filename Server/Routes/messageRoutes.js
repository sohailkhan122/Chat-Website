const express = require("express");
const { message, getMessages } = require("../Controller/messageController");

const Router = express.Router();

Router.post('/message', message);
Router.get('/getMessages/:id', getMessages);

module.exports = Router;