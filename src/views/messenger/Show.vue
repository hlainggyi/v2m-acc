<template>
<v-ons-page>
  <custom-toolbar backLabel="Back" :title="post.userName">
  </custom-toolbar>
  <v-ons-card>
    <div class="title">
      {{ post.userName }}
    </div>
    <div class="content">
      <span>{{ post.createdOn | formatDate }}</span>
    </div>
    <span>{{ post.content }}</span>
    <hr>
    <v-ons-row>
      <v-ons-col>
        <v-ons-icon icon="md-thumb-up"></v-ons-icon>
        {{ post.likes }}
      </v-ons-col>
      <v-ons-col>
        <v-ons-icon icon="md-comment"></v-ons-icon>
        {{ post.comments }}
      </v-ons-col>
    </v-ons-row>
  </v-ons-card>
  <v-ons-card>
    <div class="center">
      <textarea class="textarea comment-item" placeholder="Type a message ..." v-model.trim="comment.content">
          </textarea>
      <v-ons-icon size="30px" class="comment-item-icon" icon="md-mail-send" v-if="comment.content == ''">
      </v-ons-icon>
      <v-ons-icon size="30px" class="right-item-icon" style="color:rgb(30, 136, 229); padding-left:10px" icon="md-mail-send" v-if="comment.content != ''" @click="addComment" :disabled="comment.content == ''">
      </v-ons-icon>
    </div>
  </v-ons-card>
  <v-ons-card v-show="postComments.length">
    <div v-for="comment in postComments" class="comment-border">

      <div class="content">
        <v-ons-row>
          <v-ons-col>
            {{ comment.userName }}
          </v-ons-col>
          <v-ons-col>{{ comment.createdOn | formatDate }}</v-ons-col>
        </v-ons-row>
      </div>
      <hr>
      <span>{{ comment.content }}</span>
    </div>
  </v-ons-card>

</v-ons-page>
</template>

<script>
const fb = require("@/firebaseConfig");
import { db } from "@/firebaseConfig";
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      postComments: [],
      comment: {
        content: "",
        postComments: 0
      },
      showPostModal: false
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"]),
    name() {
      return this.$store.state.userProfile.name;
    }
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    getData() {
      db.collection("comments")
        .where("postId", "==", this.postId)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          let commentsArray = [];
          querySnapshot.forEach(doc => {
            let comment = doc.data();
            comment.id = doc.id;
            commentsArray.push(comment);
          });
          this.postComments = commentsArray;
        });
    },
    addComment() {
      let postId = this.post.id;
      let postComments = this.post.comments;

      fb.commentsCollection
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName: this.userProfile.name
        })
        .then(doc => {
          fb.postsCollection
            .doc(postId)
            .update({
              comments: postComments + 1
            })
            .then(() => {
              this.comment.content = "";
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

.comment-border {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.comment-item {
  position: relative;
}

.comment-item-icon {
  position: absolute;
  /* position: fixed; */
  bottom: 0;
  right: 0;
  padding-right: 25px;
  padding-bottom: 15px;
}
</style>
