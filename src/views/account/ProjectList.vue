<template lang="html">
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-header>
        Total
      </v-ons-list-header>
      <v-ons-list-item>
        <div class="center">
          <v-ons-row>
            <v-ons-col>
              <strong>Start</strong>
            </v-ons-col>
            <v-ons-col width="100px" style="text-align: right; padding-right:5px">
              <strong>{{ startProject }}</strong>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="right">
          <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center">
          <v-ons-row>
            <v-ons-col>
              <strong>Running</strong>
            </v-ons-col>
            <v-ons-col width="100px" style="text-align: right; padding-right:5px">
              <strong>{{ runningProject }}</strong>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="right">
          <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center">
          <v-ons-row>
            <v-ons-col>
              <strong>Finish</strong>
            </v-ons-col>
            <v-ons-col width="100px" style="text-align: right; padding-right:5px">
              <strong>{{ finishProject }}</strong>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="right">
          <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center">
          <v-ons-row>
            <v-ons-col>
              <strong>Total Project</strong>
            </v-ons-col>
            <v-ons-col width="100px" style="text-align: right; padding-right:5px">
              <strong>{{ allProject }}</strong>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="right">
          <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
        </div>
      </v-ons-list-item>      
    </v-ons-list>
    <hr>
    <v-ons-list class="p-bottom">
      <v-ons-list-item>
        <b-field style="width:97%">
          <b-select v-model="selectAction" expanded placeholder="Select Project ...">
            <option v-for="action in actions" :key="action">
              {{ action }}
            </option>
          </b-select>
        </b-field>
      </v-ons-list-item>
      <v-ons-list-item v-for="project in projects" :key="project.id">
        <v-ons-card style="width:97%; margin-left:-1px;">
          <div class="title">
            <v-ons-row>
              <v-ons-col>{{ project.name }}</v-ons-col>
              <v-ons-col width="50px" @click="edit(animation, project)"><v-ons-icon icon="fa-pencil"></v-ons-icon></v-ons-col>
            </v-ons-row>
          </div>
          <div class="content">
            <v-ons-row>
              <v-ons-col>Target Date</v-ons-col>
              <v-ons-col>{{ project.date.toDate() | moment('DD - MMM - YYYY') }}</v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <v-ons-col>Agree Amout</v-ons-col>
              <v-ons-col>{{ project.amount }}</v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <v-ons-col>Partner</v-ons-col>
              <v-ons-col>{{ project.partner }}</v-ons-col>
            </v-ons-row>
            <hr>
            <p> <strong>Remark</strong> </p>
            {{ project.remark }}
          </div>
        </v-ons-card>
      </v-ons-list-item>
      <br><br><br>
    </v-ons-list>
      <v-ons-fab
          position='bottom right'
          modifier='mini'
          style="background-color: rgb(30, 136, 229);
    transition: all 0s ease 0s;
    color: white;"
          @click="create(animation)">
        <v-ons-icon icon="md-plus"></v-ons-icon>
      </v-ons-fab>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
import moment from "moment";
import ProjectCreate from "./ProjectCreate.vue";
import ProjectEdit from "./ProjectEdit.vue";
const green = [67, 160, 71];
export default {
  data() {
    return {
      animation: "default",
      colors: green,
      animationOptions: {},
      projects: [],
      actions: ["start", "running", "finish"],
      selectAction: "running",
      getAction: "running",
      allProject: null,
      startProject: null,
      runningProject: null,
      finishProject: null
    };
  },
  computed: {
    swipeTheme() {
      return (
        this.md && {
          backgroundColor: `rgb(${this.colors.join(",")})`,
          transition: `all ${this.animationOptions.duration || 0}s ${this
            .animationOptions.timing || ""}`
        }
      );
    }
  },
  watch: {
    selectAction() {
      if (this.selectAction != this.getAction) {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
    this.countProject();
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    getData() {
      this.getAction = this.selectAction;
      db.collection("project-names")
        .where("action", "==", this.selectAction)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          const projects = [];
          const projectsArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            projectsArray.push(doc.data());
            projectsArray[i].id = doc.id;
            projects.push(projectsArray[i]);
            i++;
          });
          // this.countProject = projects.length
          this.projects = projects;
        });
    },
    countProject() {
      db.collection("project-names").onSnapshot(querySnapshot => {
        const projects = [];
        querySnapshot.forEach(doc => {
          projects.push(doc.data());
        });
        this.allProject = projects.length;
      }),
        db
          .collection("project-names")
          .where("action", "==", "start")
          .onSnapshot(querySnapshot => {
            const projects = [];
            querySnapshot.forEach(doc => {
              projects.push(doc.data());
            });
            this.startProject = projects.length;
          }),
        db
          .collection("project-names")
          .where("action", "==", "running")
          .onSnapshot(querySnapshot => {
            const projects = [];
            querySnapshot.forEach(doc => {
              projects.push(doc.data());
            });
            this.runningProject = projects.length;
          }),
        db
          .collection("project-names")
          .where("action", "==", "finish")
          .onSnapshot(querySnapshot => {
            const projects = [];
            querySnapshot.forEach(doc => {
              projects.push(doc.data());
            });
            this.finishProject = projects.length;
          });
    },
    create(name) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: ProjectCreate,
        data() {
          return {
            animation: name
          };
        }
      });
    },
    edit(name, data) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        project: data,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: ProjectEdit,
        data() {
          return {
            animation: name,
            project: data,
            editDate: {
              date: new Date(data.date.toDate())
            }
          };
        }
      });
    }
  }
};
</script>

<style scoped>
.left {
  max-width: 100px;
}
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
