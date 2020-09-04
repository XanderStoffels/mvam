<template>
  <v-container>
      <div v-show="showRegistration">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <chat-registration v-on:register="registering"/>
          </v-col>
        </v-row>
      </div>
      <div v-show="!showRegistration" :key="'chatWindow'">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <chat-window ref="chatWindow"/>
          </v-col>
        </v-row>
      </div>
  </v-container>
</template>

<script>
import ChatRegistration from "@/components/ChatRegistration";
import ChatWindow from "@/components/ChatWindow";

export default {
  name: "Chat",
  components: {
    ChatRegistration,
    ChatWindow
  },
  data: () => ({
    showRegistration: true,
    registrationInfo: null
  }),
  methods: {
    registering(regInfo) {
      this.showRegistration = false;
      this.registrationInfo= regInfo;
      this.$refs.chatWindow.connect(regInfo);
    }
  }
}
</script>

<style scoped>

</style>