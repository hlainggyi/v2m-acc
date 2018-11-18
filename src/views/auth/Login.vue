<template>
<v-ons-page>
  <v-ons-list style="height: 100%">
    <v-ons-list-item :modifier="md ? 'nodivider' : ''">
      <div class="center">
        <img src="../../assets/user-login-icon.png" alt="Wan Yu" style="width: 328px">
      </div>
    </v-ons-list-item>
    <br>
    <v-ons-list-item style="width:90%">
      <div class="left">
        <v-ons-icon v-if="loginForm.email != ''" style="color:blue" icon="ion-email" class="list-item__icon"></v-ons-icon>
        <v-ons-icon v-else icon="ion-email" class="list-item__icon"></v-ons-icon>
      </div>
      <label class="center">
        <v-ons-input type="email" placeholder="Eamil" float v-model.trim="loginForm.email" style="width:100%">
        </v-ons-input>
      </label>
    </v-ons-list-item>
    <v-ons-list-item style="width:90%">
      <div class="left">
        <v-ons-icon v-if="loginForm.password != ''" style="color:blue" icon="ion-android-lock" class="list-item__icon"></v-ons-icon>
        <v-ons-icon v-else icon="ion-android-lock" class="list-item__icon"></v-ons-icon>
      </div>
      <label class="center">
        <v-ons-input type="password" float placeholder="Password" style="width:100%" v-model.trim="loginForm.password">
        </v-ons-input>
      </label>
    </v-ons-list-item>
    <v-ons-list-item style="width:90%">
      <div class="left">
        <v-ons-icon style="color:blue" icon="ion-sigin" class="list-item__icon"></v-ons-icon>
      </div>
      <label class="center">
        <ons-button style="backgroundColor:blue" @click="login" modifier="cta" class="login-button">Log In</ons-button>
      </label>
    </v-ons-list-item>
  </v-ons-list>
  <transition name="fade">
    <div v-if="performingRequest" class="loading">
      <p>Loading...</p>
    </div>
  </transition>
</v-ons-page>
</template>

<script>
const fb = require("@/firebaseConfig.js");

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    login() {
      this.performingRequest = true;

      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          // this.$router.push('/dashboard')
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-item--material {
  padding: 16px;
}

input[type="email"],
input[type="password"] {
  display: block;
  width: 100%;
  margin: 0 auto;
  outline: none;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 6px;
}

.login-button {
  width: 100%;
  margin: 0 auto;
  /* color: #FFFFFF;
  background-color: rgb(67, 160, 71); */
}

.forgot-password {
  display: block;
  margin: 8px auto 0 auto;
  font-size: 14px;
}
</style>
