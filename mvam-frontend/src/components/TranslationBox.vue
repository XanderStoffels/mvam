<template>
  <v-container>
    <div class="input-section">
      <v-row class="language-options">
        <v-col cols="12">

        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="11" md="6">
          <v-card class="file-droppable" elevation="1" @drop.prevent="dropFile" @dragover.prevent>
            <v-card-title>
              <p class="text-h6 primary-color-text font-weight-medium">Input text</p>
            </v-card-title>
            <v-card-subtitle>
              <v-row justify="space-between">
                <v-col cols="9" md="8">
                  <p class="font-weight-light">To translate something, upload a file by dragging one in, clicking the upload file icon or use the provided text area below.</p>
                </v-col>
                <v-col cols="2">
                  <v-file-input id="file-upload" dense hide-input @change="filePicked"></v-file-input>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-container>
              <v-textarea id="textInput"
                          color="primary"
                          v-model="inputText"
                          outlined
                          label="Manual Input"
                          filled
                          auto-grow
                          no-resize
                          clearable
                          placeholder="Here goes the text you want to translate."
                          @blur="doTranslation"
                          @keydown="escapeInputBox"
                          @click:clear="onInputCleared"/>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="11" md="6">
          <v-banner elevation="1">
             <v-container>
               <v-row>
                 <p class="text-h6 primary-color-text font-weight-medium">Translated text</p>
                 <v-spacer/>
                 <v-btn
                     text
                     color="accent"
                     @click="copyToClipboard"
                 >Copy</v-btn>
               </v-row>
               <v-row>
                 <v-textarea id="translation" outlined :loading="currentlyTranslating" readonly v-model="translatedText" />
               </v-row>
             </v-container>
          </v-banner>
        </v-col>
      </v-row>
    </div>
    <v-snackbar
        v-model="showCopySnackbar"
        timeout="2500"
    >
      <span>Translation copied!</span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="accent"
            text
            v-bind="attrs"
            @click="showCopySnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</v-container>
</template>

<script>
import TranslationService from "@/services/TranslationService";

export default {
  name: "TranslationBox",
  data: () => ({
    inputText: "",
    currentlyTranslating: false,
    translatedText: "",
    latestTranslation: null,
    previouslyTranslated: "",
    showCopySnackbar: false
  }),

  methods: {
    async doTranslation() {
      // We don't want to request a new translation when the text has not changed.
      if (!this.isValidInput()) return;

      // Display a loading bar.
      // Use the translation service to request a translation from the backend.
      this.currentlyTranslating = "primary";
      let tservice = new TranslationService();
      let translation = await tservice.getTranslationAsync("nl", this.inputText, "en");
      if (!translation) {
        this.currentlyTranslating = false;
        this.displayTranslationError();
        return;
      }

      // Update UI with gathered information;
      this.previouslyTranslated = this.inputText;
      this.latestTranslation = translation;
      this.translatedText = translation.text;
      this.currentlyTranslating = false;
    },

    escapeInputBox(e) {
      if (e.key === "Enter" && !e.shiftKey) {
          // Blur the input.
          let input = document.getElementById("textInput");
          if (!this.inputText) this.translatedText = "";
          input.blur();
      }
    },
    displayTranslationError() {
      // TODO
    },
    isValidInput() {
      if (!this.inputText) return false;
      if (this.previouslyTranslated === this.inputText) return false;
      if (this.inputText.trim() === "") return false;
      return true;
    },
    onInputCleared() {
      this.translatedText = "";

    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.translatedText);
      this.showCopySnackbar = true;
    },
    async filePicked() {
      let input = document.getElementById("file-upload");
      if (input.files.length < 1) return;

      let tservice = new TranslationService();
      let file = input.files[0];
      let result = await tservice.uploadFileToTranslate("en", file, "nl");

      this.translatedText = result.text;
      input.value = '';
      this.inputText = "";
      await this.$vuetify.goTo("#translation");
    },
    async dropFile(e) {
      if (e.dataTransfer.files.length < 1) return;
      let input = document.getElementById("file-upload");
      input.value = '';
      input.files = e.dataTransfer.files;
      await this.filePicked();

      // Not really necessary, but it gives some feedback to the user.
      let audio = new Audio('https://freesound.org/data/previews/335/335908_5865517-lq.mp3');
      await audio.play();
    }
  }
}
</script>

<style scoped>
  .primary-color-text {
    color: #534263;
  }
  .file-droppable:drop {

  }
</style>