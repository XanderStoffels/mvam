import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    lastSourceLanguage: "",
    lastTargetLanguage: "",
    savedTranslations: [{
      source: "nl",
      target: "en",
      sourceText: "Hallo wereld!",
      targetText: "Hello world!"
    }]
  },
  mutations: {
    initialiseStore(state) {
      console.log("loading state");
      if (!localStorage.getItem('store')) return;
      this.replaceState(Object.assign(state, JSON.parse(localStorage.getItem('store'))));
    },
    setSelectedTargetLanguage(state, target) {
      state.lastTargetLanguage = target;
    },
    setSelectedSourceLanguage(state, source) {
      state.lastSourceLanguage = source;
    },
    addSavedTranslation(state, translation) {
      state.savedTranslations.append(translation);
    },
    removeSavedTranslation(state, index) {
      state.savedTranslations.splice(index, 1);
    }
  },
  actions: {

  },
  getters: {
    getSavedTargetLanguage: state => {
      return state.lastTargetLanguage;
    },
    getSavedSourceLanguage: state => {
      return state.lastSourceLanguage;
    },
    getSavedTranslations: state => {
      return state.savedTranslations;
    },
    getSavedTranslationsFrom: (state) => (source, target) => {
      return state.savedTranslations
          .filter(t => t.source === source && t.target === target);
    }
  },
  modules: {
  }
});

// Persist changes to the state to local storage.
store.subscribe(((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
  console.log("saving state");
}));

export default store;

