<template>
  <v-container>
      <v-card>
        <v-card-title>
          Chat with native speakers!
        </v-card-title>
        <div class="mx-4">
          <template v-if="chatMessages.length === 0">
            <h4 class="text--primary">Looks pretty empty here. Are you sure you are connected?</h4>
          </template>
          <div id="message-container" class="message-container">
            <template v-for="msg in chatMessages">
              <v-row :justify="isMyself(msg.sender) ? 'end' : 'start'" :key="chatMessages.indexOf(msg)">
                <v-col cols="10" md="7">
                  <v-banner dense rounded elevation="1" v-bind:class="{ 'text-right': isMyself(msg.sender), 'indigo lighten-4':  isServer(msg.sender)}">
                    <p class="text-capitalize font-weight-light">
                      {{msg.sender}}
                    </p>
                    <p class="mt-n4">
                      {{msg.body}}
                    </p>
                  </v-banner>
                </v-col>
              </v-row>
            </template>
          </div>
        </div>
        <v-card-actions v-if="chatMessages.length !== 0" class="px-4">
          <v-row justify="space-between" align="start">
            <v-col cols="9">
              <v-text-field id="input-field" @keydown.enter="sendChat" tabindex="0" @change="limitChars"  v-model="chatMessage" clearable dense outlined></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn @click="sendChat" width="100%" color="secondary">Send</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
  </v-container>
</template>

<script>
import ChatService from "@/services/ChatService";

export default {
  name: "ChatWindow",
  data: () => ({
    registrationInfo: null,
    chatMessages: [],
    chatMessage: "",
    chatClient: null
  }),
  destroyed() {
    if (this.chatClient)
      this.chatClient.disconnect();
  },
  methods: {
    connect(registrationInfo) {
      this.registrationInfo = registrationInfo;
      this.chatClient = new ChatService();

      this.chatClient.roomInfo = ((motd, count) => {
        this.addServerMessage(`${motd} There ${count === 1 ? "is" : "are"} currently ${count} ${count === 1 ? "person" : "people"} in this room.`);
      });
      this.chatClient.onMessage = (sender, body) => {
        if (sender === this.registrationInfo.username) {
          this.chatMessages.push({sender: "me", body});
        } else {
          this.chatMessages.push({sender, body});
        }
        this.scrollToLastMessage();
      };
      this.chatClient.onUserLeft = (u) => {
        this.addServerMessage(`${u} left the room!`);
      };
      this.chatClient.onUserJoin = (u) => {
        this.addServerMessage(`${u} joined the room! Say hi!`);
      };
      this.chatClient.connect(registrationInfo);
    },
    isMyself(sender) {
      return sender === "me";
    },
    isServer(sender) {
      return sender === "server";
    },
    addServerMessage(message) {
      let msg = {sender: "server", body: message};
      this.chatMessages.push(msg);
      this.scrollToLastMessage();
    },
    limitChars() {
      if (this.chatMessage.length > 144)
        this.chatMessages = this.chatMessage.substr(0, 144);
    },
    sendChat() {
      if (!this.chatMessage || this.chatMessage.trim().length < 1) return;
      if (!this.chatClient) return;
      this.chatClient.sendMessage(this.chatMessage);
      this.chatMessage = "";

      let input = document.getElementById("input-field");
      input.focus();
    },
    scrollToLastMessage() {
      // We use a timeout so that the event loop first finishes updating the DOM.
      // Afterwards we can scroll to the newly added messages.
      setTimeout(() => {
        let control = document.getElementById("message-container");
        control.scrollTop = control.scrollHeight - control.clientHeight;
      }, 0);

    }
  }
}
</script>

<style scoped>
  .message-container {
    max-height: 450px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>