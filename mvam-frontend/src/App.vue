<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
    >
      <v-app-bar-nav-icon @click="showNavigation = !showNavigation"/>
      <v-divider class="mr-4 ml-2" vertical/>
      <v-toolbar-title>
        <span class="title-bar-title">Mercier Translations</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="showNavigation" absolute temporary>
      <v-list nav dense>
        <v-list-item-group active-class="text--primary text--accent-4">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-translate</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Translate</v-list-item-title>
          </v-list-item>
          <v-list-item to="/chat">
            <v-list-item-icon>
              <v-icon>mdi-chat</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Get help from chat</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
        <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    // HelloWorld,
  },

  data: () => ({
    showNavigation: false
  }),

  beforeCreate() {
    // We need to load the previously stores Vuex state.
    this.$store.commit('initialiseStore');
  },
};
</script>

<style scoped>
  .title-bar-title {
    color: #534263;
  }
</style>
