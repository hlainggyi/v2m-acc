<template>
<v-ons-page>
  <custom-toolbar backLabel="Back" :title="title">
  </custom-toolbar>
  <v-ons-list>
    <v-ons-list-item>
      <div class="center" style="padding-right: 15px;">
        <textarea class="textarea right-item" v-focus="focused" @focus="focused = true" @blur="focused = false" placeholder="Type a message ..." v-model.trim="post.content">
        </textarea>
        <v-ons-icon size="30px" class="right-item-icon" icon="md-mail-send" v-if="post.content == ''">
        </v-ons-icon>
        <v-ons-icon size="30px" class="right-item-icon" style="color:rgb(30, 136, 229); padding-left:10px" icon="md-mail-send" v-if="post.content != ''" @click="createPost" :disabled="post.content == ''">
        </v-ons-icon>
      </div>
      <!-- <div class="right">
          </div> -->
    </v-ons-list-item>
  </v-ons-list>
</v-ons-page>
</template>

<script>
import { focus } from "vue-focus";
import { mapState } from "vuex";
const fb = require("@/firebaseConfig");
export default {
  directives: { focus: focus },
  data() {
    return {
      activeIndex: 0,
      focused: true,
      post: {
        content: ""
      }
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"]),
    name() {
      return this.$store.state.userProfile.name;
    },
    title() {
      return this.name + " is typping ..";
    }
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    createPost() {
      fb.postsCollection
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          userName: this.userProfile.name,
          comments: 0,
          likes: 0
        })
        .then(ref => {
          this.post.content = "";
        })
        .catch(err => {
          console.log(err);
        });
      this.$store.commit("navigator/pop");
    }
  }
};
</script>
<style>
.right-item {
  position: relative;
}

.right-item-icon {
  position: absolute;
  /* position: fixed; */
  bottom: 0;
  right: 0;
  padding-right: 25px;
  padding-bottom: 30px;
}
</style>
