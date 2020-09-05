import io from "socket.io-client";

export default class ChatSerivce {
    constructor() {
        this.url = process.env.NODE_ENV === 'production' ?
            "https://mercierapi.xanderapp.com" :
            this.url = "ws://localhost:3000";
        this.usersInRoom = 0;
    }

    async connect(registrationDetails) {
        if (this.socket && this.socket.connected)
            this.socket.disconnect();
vue

        this.socket = io(this.url);

        this.socket.on("connect", this.onConnected);
        this.socket.on("error", this.onError);
        this.socket.on("message", this.onMessage)
        this.socket.on("userJoin", this.onUserJoin);
        this.socket.on("userLeft", this.onUserLeft);
        this.socket.on("roomInfo", this.roomInfo);
        this.socket.emit("subscribe", registrationDetails);
        window.onbeforeunload = this.disconnect;
    }

    async sendMessage(message) {
        this.socket.emit("message", message);
    }

    async disconnect() {
        this.socket.disconnect();
    }

    async onConnected() {
        console.log("Connected to the chat server.");
    }

    async onError(e) {
        console.log("Something went wrong with the socket.")
        console.error(e);
    }

    async onMessage(sender, message) {
        console.log(message);
    }

    async onUserJoin(user) {
        console.log(`${user} joined the room!`);
        this.usersInRoom++;
    }

    async onUserLeft(user) {
        console.log(`${user} left the room!`);
        this.usersInRoom--;
    }

    async roomInfo(motd, count) {
        console.log(motd);
        console.log(`There are currently ${count} users in this room.`);
        this.usersInRoom = count;
    }
}