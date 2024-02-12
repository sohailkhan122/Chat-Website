const express = require("express");
const { createGroup, getAllGroups, addMember, sendMessage, getMessages } = require("../Controller/groupsController");

const Router = express.Router();

Router.post('/createGroups', createGroup);
Router.post('/addMemberToGroup', addMember);
Router.get('/getAllGroups', getAllGroups);
Router.post('/sendMessage/:groupId', sendMessage);
Router.get('/getGroupMessages/:groupId', getMessages);

module.exports = Router;