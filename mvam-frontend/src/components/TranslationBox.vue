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
             <p>Your translated text</p>
           </v-card-title>
           <v-card-text>
             <div class="translated-text">
                {{translatedText}}
             </div>
           </v-card-text>
         </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "TranslationBox",
  data: () => ({
    inputText: "",
    translatedText: "",
    currentlyTranslating: "accent",
  }),

  methods: {
    doTranslation() {
      this.currentlyTranslating = "primary";
      this.translatedText = this.inputText;
      this.currentlyTranslating = false;
    },
    escapeInputBox(e) {
      if (e.key === "Enter" && !e.shiftKey) {
          // Blur the input.
          let input = document.getElementById("textInput");
          input.blur();
      }
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