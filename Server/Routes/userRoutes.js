const express = require('express')
const { registerController, loginConreoller, fetchAllUsersController, getSingleDocument, updateUserProfile } = require('../Controller/userController')
const multer = require('multer');

const Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

Router.post('/userSignUp', upload.single('file'), registerController);
Router.post('/login', loginConreoller);
Router.get('/fetchalluser', fetchAllUsersController)
Router.get('/getSingleDocument/:id', getSingleDocument)
Router.get('/getSingleDocument/:id', getSingleDocument)
Router.put('/updateUserProfile', upload.single('file'), updateUserProfile);

module.exports = Router;    