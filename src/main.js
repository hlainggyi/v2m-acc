import "onsenui/css/onsenui.css"; // Onsen UI basic CSS
import "onsenui/css/onsen-css-components.css"; // Default Onsen UI CSS components
// import './onsen-css-components.css' // Onsen UI CSS components source for custom themes (requires cssnext)
import "./vue-onsenui-kitchensink.css"; // CSS specific to this app
// icons
import "@mdi/font/css/materialdesignicons.min.css";
import "./assets/css/style.css";

import Vue from "vue";
import Vuex from "vuex";
import VueOnsen from "vue-onsenui"; // For UMD
// import VueOnsen from 'vue-onsenui/esm' // For ESM
// import * as OnsenComponents from './onsen-components' // For ESM
import { store } from "./store.js";
const fb = require("./firebaseConfig.js");
import CustomToolbar from "./partials/CustomToolbar.vue";
import AppNavigator from "./AppNavigator.vue";

// V Calendar
import VCalendar from "v-calendar";
import "v-calendar/lib/v-calendar.min.css";
Vue.use(VCalendar, {
  formats: {
    title: "MMMM YYYY",
    weekdays: "W",
    navMonths: "MMM",
    input: ["L", "YYYY-MMMM-DD", "YYYY/MMMM/DD"],
    dayPopover: "L"
  }
});

import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.use(require("vue-moment"));
Vue.use(Buefy);

Vue.use(Vuex);
Vue.use(VueOnsen);

// Register components globally
// Object.values(OnsenComponents).forEach(component => Vue.component(component.name, component)) // For ESM
Vue.component("custom-toolbar", CustomToolbar); // Common toolbar

let app;
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: "#app",
      store,
      // router,
      render: h => h(AppNavigator),
      beforeCreate() {
        // Shortcut for Material Design
        Vue.prototype.md = this.$ons.platform.isAndroid();

        // Set iPhoneX flag based on URL
        if (window.location.search.match(/iphonex/i)) {
          document.documentElement.setAttribute("onsflag-iphonex-portrait", "");
          document.documentElement.setAttribute(
            "onsflag-iphonex-landscape",
            ""
          );
        }
      }
    });
  }
});
