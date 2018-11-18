<template>
  <v-ons-page>
    <custom-toolbar backLabel="Anim" title="Create new user">
      <template slot="right">
        <v-ons-icon style="color:white; padding-right:10px" icon="md-check" @click="signup"></v-ons-icon>
      </template>
    </custom-toolbar>
    <v-ons-card>
      <v-ons-list style="height: 100%">
        <v-ons-list-item>
          <div class="left">
            <v-ons-icon style="color:green" icon="ion-person" class="list-item__icon"></v-ons-icon>
          </div>
          <label class="center">
            <v-ons-input type="text" placeholder="Name" float v-model.trim="signupForm.name" style="width:100%">
            </v-ons-input>
          </label>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="left">
            <v-ons-icon style="color:green" icon="ion-person" class="list-item__icon"></v-ons-icon>
          </div>
          <label class="center">
            <v-ons-input type="text" placeholder="Title" float v-model.trim="signupForm.title" style="width:100%">
            </v-ons-input>
          </label>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="left">
            <v-ons-icon style="color:green" icon="ion-flag" class="list-item__icon"></v-ons-icon>
          </div>
          <label class="center">
            <b-field style="width: 100%">
              <b-select placeholder="Role" v-model="signupForm.role" expanded>
                <option value="admin" selected>Admin</option>
                <option value="user">User</option>
              </b-select>
            </b-field>
          </label>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="left">
            <v-ons-icon style="color:green" icon="ion-email" class="list-item__icon"></v-ons-icon>
          </div>
          <label class="center">
            <v-ons-input type="email" placeholder="Eamil" float v-model.trim="signupForm.email" style="width:100%">
            </v-ons-input>
          </label>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="left">
            <v-ons-icon style="color:green" icon="ion-android-lock" class="list-item__icon"></v-ons-icon>
          </div>
          <label class="center">
            <v-ons-input type="password" float placeholder="Password" style="width:100%" v-model.trim="signupForm.password">
            </v-ons-input>
          </label>
        </v-ons-list-item>
      </v-ons-list>
      <transition name="fade">
          <div v-if="performingRequest" class="loading">
              <p>Loading...</p>
          </div>
      </transition>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
// const fb = require('@/firebaseConfig.js')
// import {auth} from '@/firebaseConfig'
// import auth from 'firebase-admin'
var admin = require("firebase-admin");

export default {
  data() {
    return {
      signupForm: {
        name: "",
        title: "",
        role: "",
        email: "",
        password: "",
        imageUrl: ""
      },
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    signup() {
      this.performingRequest = true;

      admin
        .auth()
        .createUser({
          email: this.signupForm.email,
          emailVerified: false,
          // phoneNumber: "+11234567890",
          password: this.signupForm.password,
          displayName: this.signupForm.name,
          role: this.signupForm.role,
          title: this.signupForm.title,
          photoURL: "http://www.example.com/12345678/photo.png",
          disabled: false
        })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully created new user:", userRecord.uid);
        })
        .catch(function(error) {
          console.log("Error creating new user:", error);
        });

      // fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
      // this.$store.commit('setCurrentUser', user)

      // create user obj
      // fb.usersCollection.doc(user.uid).set({
      //     name: this.signupForm.name,
      //     title: this.signupForm.title,
      //     role: this.signupForm.role,
      //     imageUrl: this.signupForm.imageUrl
      // }).then(() => {
      //     console.log("user create is success !!")
      //     this.signupForm.name = '',
      //     this.signupForm.role = '',
      //     this.signupForm.title = '',
      //     this.signupForm.email = '',
      //     this.signupForm.password = '',
      //     this.signupForm.imageUrl = ''
      //     // this.$store.dispatch('fetchUserProfile')
      //     // this.performingRequest = false
      //     // this.$router.push('/dashboard')
      // }).catch(err => {
      //     console.log(err)
      //     this.performingRequest = false
      //     this.errorMsg = err.message
      // })
      // }).catch(err => {
      //     console.log(err)
      //     this.performingRequest = false
      //     this.errorMsg = err.message
      // })
    }
  }
};
</script>
