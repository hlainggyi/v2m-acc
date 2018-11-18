<template lang="html">
  <v-ons-list class="p-bottom">
    <v-ons-list-item>
      <b-field style="width:97%">
        <b-select v-model="selectAction" expanded placeholder="Select Project ...">
          <option v-for="action in actions" :key="action" :value="action">
            {{ action }}
          </option>
        </b-select>
      </b-field>
    </v-ons-list-item>
    <v-ons-list-item>
      <b-field style="width:97%">
        <b-select v-model="selectProjectName" expanded placeholder="Select Project ...">
          <option v-for="projectName in projectNames" :key="projectName.id" :value="projectName">
            {{ projectName.name }}
          </option>
        </b-select>
        <button class="button fab-btn" v-if="selectProjectName.name == null">
                  <b-icon icon="eye"></b-icon>
              </button>
        <button class="button fab-btn" v-if="selectProjectName.name != null" @click="viewProject(animation, selectProjectName)">
                  <b-icon icon="eye"></b-icon>
              </button>
      </b-field>
    </v-ons-list-item>
    <v-ons-list-item v-if="selectProjectName.name != null">
      <div class="center">
        <v-ons-row>
          <v-ons-col>
            <strong>Agree Amount</strong>
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <strong>{{ selectProjectName.amount }}</strong>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
    <v-ons-list-header>
      Income
    </v-ons-list-header>
    <v-ons-list-item v-for="projectIncomeTotal in projectIncomeTotals" :key="projectIncomeTotal.name" v-if="projectIncomeTotals[0].title != ''">
      <div class="center" v-show="projectIncomeTotal.incomes != 0">
        <v-ons-row>
          <v-ons-col>
            {{ projectIncomeTotal.title }}
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <span>{{ projectIncomeTotal.incomes }}</span>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right" v-show="projectIncomeTotal.incomes != 0">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
    <v-ons-list-item>
      <div class="center">
        <v-ons-row>
          <v-ons-col>
            <strong>Total Income</strong>
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <strong>{{ projectIncomeTotalAmount }}</strong>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
    <v-ons-list-header>
      Expense
    </v-ons-list-header>
    <v-ons-list-item v-for="projectExpenseTotal in projectExpenseTotals" :key="projectExpenseTotal.name" v-if="projectExpenseTotals[0].title != ''">
      <div class="center" v-show="projectExpenseTotal.expenses != 0">
        <v-ons-row>
          <v-ons-col>
            {{ projectExpenseTotal.title }}
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <span>{{ projectExpenseTotal.expenses }}</span>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right" v-show="projectExpenseTotal.expenses != 0">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
    <v-ons-list-item>
      <div class="center">
        <v-ons-row>
          <v-ons-col>
            <strong>Total Expense</strong>
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <strong>{{ projectExpenseTotalAmount }}</strong>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
    <hr>
    <v-ons-list-item>
      <div class="center">
        <v-ons-row>
          <v-ons-col>
            <strong>Balance</strong>
          </v-ons-col>
          <v-ons-col width="100px" style="text-align: right; padding-right:5px">
            <strong v-if="projectBalance >= 0">{{ projectBalance }}</strong>
            <strong v-if="projectBalance <0 " style="color:red"> {{ projectBalance }} </strong>
          </v-ons-col>
        </v-ons-row>
      </div>
      <div class="right">
        <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
      </div>
    </v-ons-list-item>
  </v-ons-list>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
import ShowProject from "@/views/account/ShowProject.vue";
export default {
  // props: ['projectName'],
  data() {
    return {
      animation: "default",
      actions: ["start", "running", "finish"],
      selectAction: 'running',
      selectedAction: 'running',
      selectProjectName: {
        id: "",
        name: null,
        amount: ""
      },
      projectName: { id: "" },
      projectNames: [],
      projectIncomeTotals: [],
      projectExpenseTotals: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    projectIncomeTotalAmount() {
      return this.projectIncomeTotals.reduce(function(
        carry,
        projectIncomeTotal
      ) {
        return carry + parseFloat(projectIncomeTotal.incomes);
      },
      0);
    },
    projectExpenseTotalAmount() {
      return this.projectExpenseTotals.reduce(function(
        carry,
        projectExpenseTotal
      ) {
        return carry + parseFloat(projectExpenseTotal.expenses);
      },
      0);
    },
    projectBalance() {
      return (
        this.projectIncomeTotalAmount -
        parseFloat(this.projectExpenseTotalAmount)
      );
    }
  },
  watch: {
    selectProjectName() {
      if (this.selectProjectName.name != null) {
        if (this.projectName.id != this.selectProjectName.id) {
          this.getData();
        }
      }
    },
    selectAction() {
      if (this.selectAction != this.selectedAction) {
        this.getProjectName();
      }
    }
  },
  created() {
    this.getProjectName();
    if (this.selectProjectName.name != null) {
      this.getData();
    }
  },
  methods: {
    getProjectName() {
      this.selectedAction = this.selectAction;
      db.collection("project-names")
        .where("action", "==", this.selectAction)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          const names = [];
          const namesArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            namesArray.push(doc.data());
            namesArray[i].id = doc.id;
            names.push(namesArray[i]);
            i++;
          });
          this.projectNames = names;
          this.selectProjectName = names[0];
        });
    },
    getData() {
      this.projectName.id = this.selectProjectName.id;
      db.collection("income-titles").onSnapshot(querySnapshot => {
        let amountsArray = [];
        querySnapshot.forEach(doc => {
          let title = doc.data().name;
          let projectId = this.selectProjectName.id;
          db.collection("incomes")
            .where("projectId", "==", projectId)
            .where("title", "==", title)
            .onSnapshot(querySnapshot => {
              const incomes = [];
              let i = 0;
              querySnapshot.forEach(doc => {
                let amount = doc.data().account.amount;
                incomes.push(amount);
                i++;
              });
              function getSum(total, num) {
                return total + Math.round(num);
              }
              amountsArray.push({
                title: title,
                incomes: incomes.reduce(getSum, 0)
              });
            });
          this.projectIncomeTotals = amountsArray;
        });
      });
      db.collection("expense-titles").onSnapshot(querySnapshot => {
        let amountsArray = [];
        querySnapshot.forEach(doc => {
          let title = doc.data().name;
          let projectId = this.selectProjectName.id;
          db.collection("expenses")
            .where("projectId", "==", projectId)
            .where("title", "==", title)
            .onSnapshot(querySnapshot => {
              const expenses = [];
              let i = 0;
              querySnapshot.forEach(doc => {
                let amount = doc.data().account.amount;
                expenses.push(amount);
                i++;
              });
              function getSum(total, num) {
                return total + Math.round(num);
              }
              amountsArray.push({
                title: title,
                expenses: expenses.reduce(getSum, 0)
              });
            });
          this.projectExpenseTotals = amountsArray;
        });
      });
    },
    viewProject(name, selectProjectName) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        selectProjectName: selectProjectName,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: ShowProject,
        data() {
          return {
            animation: name,
            selectProjectName: selectProjectName
          };
        }
      });
    }
  }
};
</script>
<style scoped>
.p-bottom {
  padding-bottom: 50px;
}
</style>
