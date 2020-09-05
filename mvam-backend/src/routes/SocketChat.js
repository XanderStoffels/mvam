module.exports = function(io) {
    const motds = ["Look who just arrived!", "Well hello there! 👋", "Hi there! 👋", "Welcome! 👋", "Greetings! 👋"];
    io.on('connection', (socket) => {
        socket.userInfo = {
            room: '',
            username: ''
        };
        /**
         * Users can join a room were they can chat with other users, helping them with their questions.
         */
        socket.on("subscribe", (regDetails) => {
            socket.userInfo.username = regDetails.username;
            socket.userInfo.room = `${regDetails.sourceLang}-${regDetails.targetLang}`;
            socket.join(socket.userInfo.room);

            // Welcome the user and notify rest of the room.
            const room = io.sockets.adapter.rooms[socket.userInfo.room];
            const clientCount = room.length;
            socket.emit("roomInfo", motds[Math.floor(Math.random() * motds.length)], clientCount);
            socket.to(socket.userInfo.room).emit("userJoin", regDetails.username);
        });

        socket.on("message", (message) => {
            io.to(socket.userInfo.room).emit("message", socket.userInfo.username, message);
        });

        socket.on('disconnect', () => {
            io.to(socket.userInfo.room).emit("userLeft", socket.userInfo.username);
        });
    });
}