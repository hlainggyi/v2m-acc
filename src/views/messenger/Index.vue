<template>
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="'Meeting Room'">
    </custom-toolbar>
    <v-ons-list>
      <v-ons-list-item>
        <div class="left">
          <v-ons-icon size="30px" style="color:rgb(30, 136, 229);" icon="md-face"></v-ons-icon>
        </div>
        <div class="center">
          <b-field>
            <b-input :placeholder="placeholder" @focus="create(animation)" rounded>
            </b-input>
          </b-field>
        </div>
        <div class="right">
          <v-ons-icon size="25px" style="color:rgb(30, 136, 229);padding-left:10px" icon="md-mail-send" @click="create(animation)"></v-ons-icon>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <transition name="fade">
      <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
        <p>
          Click to show <span class="new-posts">{{ hiddenPosts.length }}</span> new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
        </p>
      </div>
    </transition>
    <div v-if="posts.length">
      <div v-for="post in posts" class="post">
        <v-ons-card class="post-user">
          <span class="post-user-name">{{ post.userName }}</span>
          <span class="post-user-time">{{ post.createdOn | formatDate }}</span>
          <div class="content" @click="viewPost(animation, post)">{{ post.content | trimLength }}</div>
          <v-ons-row>
            <v-ons-col>
              <a @click="likePost(post.id, post.likes)">
                <v-ons-icon icon="md-thumb-up"></v-ons-icon>
                {{ post.likes }}</a>
            </v-ons-col>
            <v-ons-col>
              <a @click="viewPost(animation, post)">
                <v-ons-icon icon="md-comment"></v-ons-icon>
                {{ post.comments }}</a>
            </v-ons-col>
            <v-ons-col>
              <a @click="viewPost(animation, post)">
                <v-ons-icon icon="md-eye"></v-ons-icon>
              </a>
            </v-ons-col>
          </v-ons-row>
        </v-ons-card>
      </div>
    </div>
    <div v-else>
      <v-ons-list>
        <v-ons-list-item>
          <p class="no-results">There are currently no posts</p>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-page>
</template>

<script>
const fb = require("@/firebaseConfig");
import { mapState } from "vuex";
import moment from "moment";
import Create from "./Create.vue";
import Show from "./Show.vue";
export default {
  name: "Messenger",
  data() {
    return {
      animation: "default",
      post: {
        content: ""
      },
      comment: {
        postId: "",
        userId: "",
        content: "",
        postComments: 0
      },
      showCommentModal: false,
      showPostModal: false,
      fullPost: {},
      postComments: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"]),
    name() {
      return this.$store.state.userProfile.name;
    },
    placeholder() {
      return "Type a message ...  " + this.name;
    }
  },
  methods: {
    create(name) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: Create,
        data() {
          return {
            animation: "none"
          };
        }
      });
    },
    viewPost(name, data) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        post: data,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: Show,
        data() {
          return {
            animation: name,
            post: data,
            postId: data.id
          };
        }
      });
    },
    showNewPosts() {
      let updatedPostsArray = this.hiddenPosts.concat(this.posts);
      // clear hiddenPosts array and update posts array
      this.$store.commit("setHiddenPosts", null);
      this.$store.commit("setPosts", updatedPostsArray);
    },
    likePost(postId, postLikes) {
      let docId = `${this.currentUser.uid}_${postId}`;

      fb.likesCollection
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          }
          fb.likesCollection
            .doc(docId)
            .set({
              postId: postId,
              userId: this.currentUser.uid
            })
            .then(() => {
              // update post likes
              fb.postsCollection.doc(postId).update({
                likes: postLikes + 1
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
};
</script>

<style>
.input:active,
.input:focus,
.taginput .taginput-container.is-focusable:focus,
.input.is-focused,
.taginput .is-focused.taginput-container.is-focusable,
.input:active,
.taginput .taginput-container.is-focusable:active,
.input.is-active,
.taginput .is-active.taginput-container.is-focusable,
.textarea:focus,
.textarea.is-focused,
.textarea:active,
.textarea.is-active {
  border-color: rgb(30, 136, 229);
}

.list-item--material__left {
  min-width: 40px;
}

.post-user {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  /* border: 1px solid #ffdd57; */
  /* border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  color: rgba(0,0,0,.7); */
}

.post-user-name {
  background: #d6d8db;
  border-radius: 4px 4px 0 0;
  bottom: 100%;
  display: inline-block;
  font-size: 8px;
  font-weight: 700;
  left: -1px;
  padding: 4px 8px;
  position: absolute;
  text-transform: uppercase;
  vertical-align: top;
}

.post-user-time {
  background: #d6d8db;
  border-radius: 4px 4px 0 0;
  bottom: 100%;
  display: inline-block;
  font-size: 8px;
  font-weight: 700;
  right: -1px;
  padding: 4px 8px;
  position: absolute;
  text-transform: uppercase;
  vertical-align: top;
}
</style>
