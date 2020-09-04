<template>
  <v-container>
    <v-card>
      <v-card-title>Chat registration</v-card-title>
      <v-card-subtitle>
        To start chatting, please provide the following information.
      </v-card-subtitle>
      <v-card-text>
        <v-form>
          <v-text-field v-model="username" label="Username" clearable required/>
          <v-row>
            <v-col>
              <v-select :items="availableLanguages"
                        v-model="selectedSourceLang"
                        item-text="name"
                        item-value="code"
                        outlined
                        label="From"/>
            </v-col>
            <v-col>
              <v-select :items="availableLanguages"
                        v-model="selectedTargetLang"
                        item-text="name"
                        item-value="code"
                        outlined
                        label="To"/>
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col cols="12" md="5" lg="3">
              <v-btn @click="register" :disabled="!inputIsValid" width="100%" color="secondary">
                <span class="text--primary">Enter!</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TranslationService from "@/services/TranslationService";

export default {
  name: "ChatRegistration",
  data: () => ({
    username: "",
    availableLanguages: [ {code: '', name: ''}],
    selectedSourceLang: null,
    selectedTargetLang: null,
  }),
  async mounted() {
    let service = new TranslationService();
    let data = await service.getAvailableLanguages()
    Object.keys(data)
        .forEach(k => this.availableLanguages.push({code: k, name: data[k]}));
  },
  computed: {
    inputIsValid: function () {
      if (!this.selectedTargetLang || !this.selectedSourceLang) return false;
      if (!this.username || this.username.length < 2) return false;
      return true;
    }
  },
  methods: {
    register() {
      this.$emit("register", {
        username: this.username,
        sourceLang: this.selectedSourceLang,
        targetLang: this.selectedTargetLang
      });
    }
  }
}
</script>

<style scoped>

</style>