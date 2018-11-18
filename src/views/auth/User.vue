<template>
  	<v-ons-page>
  		  <custom-toolbar backLabel="Home" :title="'User'">
  				<template slot="right">
  					<v-ons-icon style="color:white" icon="md-plus" @click="addUser(animation)"> </v-ons-icon>
  			  </template>
  		  </custom-toolbar>
      <v-ons-list>
        <v-ons-list-item v-for="user in users" :key="user.id" modifier="chevron" class="list-item-container">
          <div class="left">
            {{ user.id + 1}}
          </div>
          <div class="center">
            <span class="list-item__title">{{ user.name }}</span>
            <small class="list-item__subtitle">{{ user.email }}</small>
          </div>
          <div class="right">
          </div>
        </v-ons-list-item>
      </v-ons-list>

  	</v-ons-page>

</template>
<script type="text/javascript">
// import Flash from '../../helpers/flash'
import { get, apiDomain } from "../../helpers/api";
import UserRegister from "./Register.vue";
export default {
  data() {
    return {
      animation: "default",
      users: {},
      error: {}
    };
  },
  created() {
    get(apiDomain + `/users`).then(res => {
      this.users = res.data.users;
    });
  },
  methods: {
    addUser(name) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });

      this.$store.commit("navigator/push", {
        extends: UserRegister,
        data() {
          return {
            animation: name,
            title: "Register User"
          };
        }
      });
    }
  }
};
</script>
