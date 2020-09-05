<template>
  <v-container>
    <div class="input-section">
        <v-row class="language-options" justify="space-around">
          <v-col cols="6">
            <v-select :items="availableLanguages"
                      v-model="selectedSourceLang"
                      @change="languageChange('source')"
                      item-text="name"
                      item-value="code"
                      outlined
                      label="From"/>
          </v-col>
          <v-col cols="6">
            <v-select :items="availableLanguages"
                      v-model="selectedTargetLang"
                      @change="languageChange('target')"
                      item-text="name"
                      item-value="code"
                      outlined
                      label="To"/>
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
                  <p class="font-weight-light">To translate something, upload a text file by dragging one in, clicking the upload file icon or use the provided text area below.</p>
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
                          :disabled="!isInputEnabled"
                          auto-grow
                          no-resize
                          clearable
                          placeholder="Here goes the text you want to translate."
                          @blur="doTranslation(false)"
                          @keydown="escapeInputBox"
                          @click:clear="onInputCleared"/>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="11" md="6">
          <v-banner rounded elevation="1">
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
        v-model="snackbarOptions.show"
        timeout="2500"
    >
      <span>{{snackbarOptions.text}}</span>
      <template v-slot:action="{ attrs }">
        <v-btn
            :color="snackbarOptions.color"
            text
            v-bind="attrs"
            @click="snackbarOptions.show = false"
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
    snackbarOptions: {show: false, color: 'accent', text: 'Translation Copied!'},
    availableLanguages: [ {code: '', name: ''}],
    selectedSourceLang: null,
    selectedTargetLang: null,
  }),

  async mounted() {
    let service = new TranslationService();
    let data = await service.getAvailableLanguages()
    Object.keys(data)
        .forEach(k => this.availableLanguages.push({code: k, name: data[k]}));

      // Select the last selected language from a previous translation session.
      this.selectedTargetLang = this.$store.getters.getSavedTargetLanguage;
      this.selectedSourceLang = this.$store.getters.getSavedSourceLanguage;
  },

  computed: {
    isInputEnabled: function() {
      if (this.availableLanguages?.length < 1) return false;
      if (!this.selectedTargetLang || !this.selectedSourceLang) return false;
      return true;
    }
  },

  methods: {
    async doTranslation(skipValidation) {
      // We don't want to request a new translation when the text is not valid.
      if (!this.isInputEnabled) {
        return;
      }
      if (!this.inputText || (!skipValidation && !this.isValidInput()))
        return;

      // Display a loading bar.
      // Use the translation service to request a translation from the backend.
      this.currentlyTranslating = "primary";
      let tservice = new TranslationService();
      let translation =
          await tservice.getTranslationAsync(this.selectedSourceLang, this.inputText, this.selectedTargetLang);
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
      console.log("Something went wrong translating.")
      this.snackbarOptions = {show: true, color: 'red', text: 'Translation Failed! Are you connected to the internet?'};
    },
    isValidInput() {
      if (this.previouslyTranslated === this.inputText) return false;
      if (this.inputText.trim() === "") return false;
      return true;
    },
    onInputCleared() {
      this.translatedText = "";
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.translatedText);
      this.snackbarOptions.show = {show: false, color: 'accent', text: 'Translation Copied!'}
    },
    async filePicked() {
      let input = document.getElementById("file-upload");
      if (input.files.length < 1) return;

      let tservice = new TranslationService();
      let file = input.files[0];
      if (file.name.endsWith(".txt") && this.selectedSourceLang && this.selectedTargetLang) {
        let result = await tservice.uploadFileToTranslate(this.selectedSourceLang, file, this.selectedTargetLang);
        await this.$vuetify.goTo("#translation");
        await this.$vuetify.goTo("#translation");
        this.translatedText = result.text;
        this.inputText = "";
      }
      input.value = '';
    },
    async dropFile(e) {
      if (e.dataTransfer.files.length < 1) return;
      let input = document.getElementById("file-upload");
      input.value = '';
      input.files = e.dataTransfer.files;
      await this.filePicked();
    },
    async languageChange(origin) {
      await this.doTranslation(true);
      switch (origin) {
        case 'source':
          this.$store.commit('setSelectedSourceLanguage', this.selectedSourceLang);
          break;
        case 'target':
          this.$store.commit('setSelectedTargetLanguage', this.selectedTargetLang);
          break;
      }
    }
  }
}
</script>

<style scoped>
  .primary-color-text {
    color: #534263;
  }
</style>