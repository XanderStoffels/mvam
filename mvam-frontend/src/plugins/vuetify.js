import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#534263',
                secondary: '#c4caea',
                anchor: '#8c9eff',
                accent: '#feb035'
            },
        },
    }
});
