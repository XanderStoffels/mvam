<template>
  <v-container>
    <div class="input-section">
      <v-row class="language-options">
        <v-col cols="12">

        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="11" md="6">
          <v-textarea id="textInput"
                      color="primary"
                      v-model="inputText"
                      outlined
                      label="Input"
                      filled
                      auto-grow
                      no-resize
                      clearable
                      placeholder="Here goes the text you want to translate."
                      @blur="doTranslation"
                      @keydown="escapeInputBox"
                      @click:clear="onInputCleared"
          />
        </v-col>
        <v-col cols="11" md="6">
          <v-banner elevation="1">
             <v-container>
               <v-row>
                 <p class="text-h6 primary-color-text">Translated text</p>
                 <v-spacer/>
                 <v-btn
                     text
                     color="accent"
                     @click="copyToClipboard"
                 >Copy</v-btn>
               </v-row>
               <v-row>
                 <v-textarea :loading="currentlyTranslating" readonly v-model="translatedText" />
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
    }
  }
}
</script>

<style scoped>
.primary-color-text {
  color: #534263;
}
</style>