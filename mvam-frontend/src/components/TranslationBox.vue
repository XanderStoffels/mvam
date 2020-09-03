<template>
  <v-container>
    <div class="input-section">
      <v-row class="language-options">

      </v-row>
      <v-row justify="center">
        <v-col cols="11">
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
          />

        </v-col>
      </v-row>
    </div>
    <div class="output-section">

      <v-row justify="center">
        <v-col cols="11">
         <v-card raised min-height="100px" :loading="currentlyTranslating">
           <v-card-title>
             <p class="text-h6">Your translated text</p>
           </v-card-title>
           <v-card-text>
             <div class="translated-text">
               {{ translatedText }}
             </div>
           </v-card-text>
         </v-card>
  </v-col>
</v-row>
</div>
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
    previouslyTranslated: ""
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
          input.blur();
      }
    },
    displayTranslationError() {

    },
    isValidInput() {
      if (!this.inputText) return false;
      if (this.previouslyTranslated === this.inputText) return false;
      if (this.inputText.trim() === "") return false;
      return true;
    }
  }
}
</script>

<style scoped>
.card-title {
  color: #534263;
}
.translated-text {
  color: #534263;
}
</style>