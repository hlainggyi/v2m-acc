<template lang="html">
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="'Create Project'">
      <template slot="right">
				<v-ons-icon style="color:blue" icon="md-check" v-show="project.name != null" @click="addProject"></v-ons-icon>
			</template>
    </custom-toolbar>
    <v-ons-card>
      <v-ons-list>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-input placeholder="Project Name"
              v-model="project.name"
              type="text">
            </b-input>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <v-date-picker mode='single' v-model='project.date'>
            <b-field slot-scope='props' label="Target Date">
              <b-input type='text' icon='calendar' :value='props.inputValue' @change.native='props.updateValue($event.target.value)' expanded>
              </b-input>
            </b-field>
          </v-date-picker>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%" label="Agree Amount">
            <b-input placeholder="Agree Amount"
              v-model="project.amount"
              type="number">
            </b-input>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-input placeholder="Partner"
              v-model="project.partner"
              type="text">
            </b-input>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width:100%">
            <b-select v-model="project.action" expanded placeholder="Select action ...">
              <option v-for="action in actions" :key="action">
                {{ action }}
              </option>
            </b-select>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item style="padding-bottom:50px">
          <b-field label="Remark" style="width:100%">
            <b-input v-model="project.remark" type="textarea"></b-input>
        </b-field>
        </v-ons-list-item>
      </v-ons-list>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
const green = [67, 160, 71];
export default {
  data() {
    return {
      project: {
        name: null,
        amount: 0,
        date: new Date(Date.now()), // Date
        partner: "",
        action: "start",
        remark: ""
      },
      actions: ["start", "running", "finish"]
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser"])
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    addProject() {
      db.collection("project-names").add({
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        createdOn: new Date(),
        name: this.project.name,
        amount: this.project.amount,
        date: this.project.date,
        partner: this.project.partner,
        action: this.project.action,
        remark: this.project.remark
      });
      (this.project.name = null),
        (this.project.amount = 0),
        (this.project.date = new Date(Date.now())),
        (this.project.partner = ""),
        (this.project.action = "start"),
        (this.project.remark = "");
      this.$store.commit("navigator/pop");
    }
  }
};
</script>

<style scoped>
.left {
  max-width: 100px;
}
</style>
