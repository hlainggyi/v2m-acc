<template>
  <v-ons-page>
    <v-ons-splitter>
      <v-ons-splitter-side swipeable side="left" collapse=""
        width="260px"
        :swipe-target-width="md && 25"
        :animation="md ? 'overlay' : 'reveal'"
        :open.sync="isOpen"
      >
        <menu-page v-if="currentUser"></menu-page>
      </v-ons-splitter-side>

      <v-ons-splitter-content>
        <app-tabbar v-if="currentUser"></app-tabbar>
        <v-login v-if="!currentUser"></v-login>
      </v-ons-splitter-content>
    </v-ons-splitter>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import AppTabbar from "./AppTabbar.vue";
import MenuPage from "./partials/Menu.vue";
import VLogin from "@/views/auth/Login.vue";

export default {
  computed: {
    ...mapState(["currentUser"]),
    isOpen: {
      get() {
        return this.$store.state.splitter.open;
      },
      set(newValue) {
        this.$store.commit("splitter/toggle", newValue);
      }
    }
  },
  components: { AppTabbar, MenuPage, VLogin }
};
</script>

<style>
ons-splitter-side[animation="overlay"] {
  border-left: 1px solid #bbb;
}
</style>
