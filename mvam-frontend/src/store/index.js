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
      if (!localStorage.getItem('store')) return;
      this.replaceState(Object.assign(state, JSON.parse(localStorage.getItem('state'))));
    }
  },
  actions: {
  },
  modules: {
  }
});
// Persist changes to the state to local storage.
store.subscribe(((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
}));
export default store;

