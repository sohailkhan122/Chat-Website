const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const UserRoute = require('./Routes/userRoutes')
const ChatRoute = require('./Routes/chatRoutes')
const MessageRoute = require('./Routes/messageRoutes')
const groupsRoute = require('./Routes/groupsRoutes')
const bodyParser = require('body-parser');

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

const connectDb = async () => {
    try {
        const connect = await mongoose.connect('mongodb+srv://sohail:iamdeveloper@cluster0.xmzwts5.mongodb.net/?retryWrites=true&w=majority');
        console.log("Server Is Connected To Database");
    } catch (error) {
        console.log("Server Is Not Connected To Database", error.message);
    }
}
connectDb()

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', UserRoute)
app.use('/', ChatRoute)
app.use('/', MessageRoute)
app.use('/', groupsRoute)


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log("Server Is Running..."))
