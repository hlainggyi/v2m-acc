<template>
<v-ons-page>
  <custom-toolbar backLabel="Back" title="User profile">
    <template slot="right">
        <v-ons-icon class="icon-color" style="padding-right:10px" icon="md-check" @click="updateProfile"></v-ons-icon>
      </template>
  </custom-toolbar>
  <v-ons-card>
    <v-ons-list style="height: 100%">
      <v-ons-list-item>
        <b-field label="Name">
          <b-input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name"></b-input>
        </b-field>
      </v-ons-list-item>
      <v-ons-list-item>
        <b-field label="Job Title">
          <b-input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title"></b-input>
        </b-field>
      </v-ons-list-item>
      <v-ons-list-item>
        <transition name="fade">
          <p v-if="showSuccess" style="color: green;">Profile updated</p>
        </transition>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-card>
</v-ons-page>
</template>


<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      name: "",
      title: "",
      showSuccess: false
    };
  },
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch("updateProfile", {
        name: this.name !== "" ? this.name : this.userProfile.name,
        title: this.title !== "" ? this.title : this.userProfile.title,
        role: this.userProfile.role,
        imageUrl: this.userProfile.imageUrl
      });

      this.name = "";
      this.title = "";
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    }
  }
};
</script>
