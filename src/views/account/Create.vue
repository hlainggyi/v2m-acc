<template lang="html">
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="'Create'">
      <template slot="right">
				<v-ons-icon style="color:blue" icon="md-check" v-show="typeTitle == 'Income'" @click="addIncome"></v-ons-icon>
				<v-ons-icon style="color:blue" icon="md-check" v-show="typeTitle == 'Expense'" @click="addExpense"></v-ons-icon>
		  </template>
    </custom-toolbar>
    <v-ons-card>
      <v-ons-list>
        <v-ons-list-item>
          <v-date-picker mode='single' v-model='account.date'>
            <b-field slot-scope='props'>
              <b-input type='text' icon='calendar' :value='props.inputValue' @change.native='props.updateValue($event.target.value)' expanded>
              </b-input>
            </b-field>
          </v-date-picker>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-select v-model="projectName" expanded placeholder="Select ..">
              <option v-for="projectName in projectNames" :key="projectName.id" :value="projectName">
                {{ projectName.name }}
              </option>
            </b-select>
            <button class="button fab-btn" @click="createProject(animation)">
                <b-icon icon="plus"></b-icon>
            </button>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-input placeholder="Amount"
              v-model="account.amount"
              type="number">
            </b-input>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-input placeholder="Description" v-model="account.description"></b-input>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="block">
            <b-radio v-model="typeTitle" native-value="Income">
              Income
            </b-radio>
            <b-radio v-model="typeTitle" native-value="Expense">
              Expense
            </b-radio>
          </div>
        </v-ons-list-item>

        <v-ons-list-item v-show="selectTitle">
          <b-field style="width: 100%">
            <b-select v-model="title" placeholder="Select ..." expanded>
              <option disabled v-if="typeTitle == ''">Select (Income or Expense)</option>
              <option v-for="cashTitleIncome in cashTitleIncomes" :key="cashTitleIncome.name" v-if="typeTitle == 'Income'">
                {{ cashTitleIncome.name }}
              </option>
              <option v-for="cashTitleExpense in cashTitleExpenses" :key="cashTitleExpense.name" v-if="typeTitle == 'Expense'">
                {{ cashTitleExpense.name }}
              </option>
            </b-select>
            <button class="button fab-btn" @click="addCashTitle">
                      <b-icon icon="plus"></b-icon>
                  </button>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item v-show="saveTitle">
          <b-field>
            <b-input placeholder="Cash Title" v-model="cashTitleIncome" v-if="typeTitle == 'Income'"></b-input>
            <button class="button fab-btn" @click="saveCashTitleIncome" v-if="(typeTitle == 'Income') && (cashTitleIncome != '')">
                      <b-icon icon="check"></b-icon>
                  </button>
            <button class="button fab-btn" @click="(selectTitle = true) && (saveTitle = false)" v-if="(typeTitle == 'Income') && (cashTitleIncome == '')">
                      <b-icon icon="check"></b-icon>
                  </button>
            <b-input placeholder="Cash Title" v-model="cashTitleExpense" v-if="typeTitle == 'Expense'"></b-input>
            <button class="button fab-btn" @click="saveCashTitleExpense" v-if="(typeTitle == 'Expense') && (cashTitleExpense != '')">
                      <b-icon icon="check"></b-icon>
                  </button>
            <button class="button fab-btn" @click="(selectTitle = true) && (saveTitle = false)" v-if="(typeTitle == 'Expense') && (cashTitleExpense == '')">
                      <b-icon icon="check"></b-icon>
                  </button>
          </b-field>
        </v-ons-list-item>
        <v-ons-list-item>
          <b-field style="width: 100%">
            <b-select v-model="account.payment_type" expanded>
              <option value="Cash" selected>Cash</option>
              <option value="Bank">Bank</option>
            </b-select>
          </b-field>
        </v-ons-list-item>
      </v-ons-list>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
import ProjectCreate from "./ProjectCreate.vue";
const green = [67, 160, 71];
export default {
  data() {
    return {
      colors: green,
      animationOptions: {},
      animation: "default",
      incomePage: true,
      expensePage: false,
      account: {
        date: new Date(Date.now()), // Date
        payment_type: "Cash", // Cash or Bank
        amount: "", // Amount
        description: "" // Description
      },
      projectName: {
        id: "",
        name: ""
      },
      projectNames: [],
      title: null,
      typeTitle: "",
      types: ["Income", "Expense"],
      error: "",
      cashTitleIncomes: [],
      cashTitleIncome: "",
      cashTitleExpenses: [],
      cashTitleExpense: "",
      selectTitle: true,
      saveTitle: false
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser"]),
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
  created() {
    this.getCashTitleIncome();
    this.getCashTitleExpense();
    this.getProjectName();
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    getProjectName() {
      db.collection("project-names")
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
          this.projectName = names[0];
          // this.projectName.id = names[0].id
        });
    },
    createProject(name) {
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
    getCashTitleIncome() {
      db.collection("income-titles").onSnapshot(querySnapshot => {
        const titles = [];
        querySnapshot.forEach(doc => {
          titles.push(doc.data());
        });
        this.cashTitleIncomes = [];
        this.cashTitleIncomes = titles;
      });
    },
    getCashTitleExpense() {
      db.collection("expense-titles").onSnapshot(querySnapshot => {
        const titles = [];
        querySnapshot.forEach(doc => {
          titles.push(doc.data());
        });
        this.cashTitleExpenses = [];
        this.cashTitleExpenses = titles;
      });
    },
    addCashTitle() {
      (this.selectTitle = false), (this.saveTitle = true);
    },
    saveCashTitleIncome() {
      db.collection("income-titles").add({
        userId: this.currentUser.uid,
        name: this.cashTitleIncome
      });
      this.getCashTitleIncome();
      this.cashTitleIncome = "";
      (this.selectTitle = true), (this.saveTitle = false);
    },
    saveCashTitleExpense() {
      db.collection("expense-titles").add({
        userId: this.currentUser.uid,
        name: this.cashTitleExpense
      });
      this.getCashTitleExpense();
      this.cashTitleExpense = "";
      (this.selectTitle = true), (this.saveTitle = false);
    },
    addIncome: function() {
      db.collection("incomes").add({
        createdOn: new Date(),
        account: this.account,
        title: this.title,
        queryDay: this.account.date.getDate(),
        monthId:
          this.account.date.getFullYear() + "-" + this.account.date.getMonth(),
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        projectId: this.projectName.id
      });
      (this.title = ""), // Cash Title
        (this.account.amount = ""), // Amount
        (this.account.description = ""); // Description
      this.$store.commit("navigator/pop");
    },
    addExpense: function() {
      db.collection("expenses").add({
        createdOn: new Date(),
        account: this.account,
        title: this.title,
        queryDay: this.account.date.getDate(),
        monthId:
          this.account.date.getFullYear() + "-" + this.account.date.getMonth(),
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        projectId: this.projectName.id
      });
      (this.title = ""), // Cash Title
        (this.account.amount = ""), // Amount
        (this.account.description = ""); // Description
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
