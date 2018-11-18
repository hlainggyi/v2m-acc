<template lang="html">
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="'Edit Project'">
      <template slot="right">
				<v-ons-icon style="color:white" icon="md-check" v-show="project.name != null" @click="saveProject"></v-ons-icon>
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
          <v-date-picker mode='single' v-model='editDate.date'>
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
      animation: "default",
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
    saveProject: function() {
      var projectRef = db.collection("project-names").doc(this.project.id);
      // Set the "capital" field of the city 'DC'
      projectRef.update({
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        createdOn: new Date(),
        name: this.project.name,
        amount: this.project.amount,
        date: this.editDate.date,
        partner: this.project.partner,
        action: this.project.action,
        remark: this.project.remark
      });
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
