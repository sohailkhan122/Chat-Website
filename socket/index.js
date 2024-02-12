import { Server } from 'socket.io';

const io = new Server(8000, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

let users = [];

const addUser = (userData, socketId) => {
    if (!users.some(user => user._id === userData._id)) {
        users.push({ ...userData, socketId });
    }
};

const getUser = (userId) => {
    return users.find(user => user._id === userId);
};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on("addUser", userData => {
        console.log("Received userData:", userData);
        addUser(userData, socket.id);
        console.log("Updated users array:", users);
        io.emit("getUsers", users);
    });

    socket.on('sendMessage', (data) => {
        console.log(data);
        const user = getUser(data.receiverId);
        if (user && user.socketId) {
            io.to(user.socketId).emit('getMessage', data);
        } else {
            console.log("User not found or socket ID not available.");
        }
    });

    socket.on('sendgroupMessage', (data) => {
        io.emit('groupMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        users = users.filter(user => user.socketId !== socket.id);
    });
});
