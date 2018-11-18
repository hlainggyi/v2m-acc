<template>
  <v-ons-page>    
    <v-ons-list-header>
        Total
    </v-ons-list-header>

    <v-ons-list-item>
          <div class="center">
            <v-ons-row>
              <v-ons-col>
                <strong>Income</strong>
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <strong>{{ IncomeTotal }}</strong>
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
                <strong>Expense</strong>
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <strong>{{ ExpenseTotal }}</strong>
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
                <strong>Remaining Balance</strong>
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <strong v-if="BalanceTotal >= 0">{{ BalanceTotal }}</strong>
                <strong v-if="BalanceTotal <0 " style="color:red"> {{ BalanceTotal }} </strong>
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right">
            <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <hr>
    <project-report></project-report>
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
import { db } from "@/firebaseConfig";
import createAccount from "@/views/account/Create.vue";
import ProjectReport from "@/views/account/ProjectReport.vue";
import Create from "@/views/account/Create.vue";
export default {
  components: { createAccount, ProjectReport },
  data() {
    return {
      animation: "default",
      totalIncomes: [],
      totalExpenses: [],
      date: new Date(Date.now())
    };
  },
  computed: {
    IncomeTotal() {
      return this.totalIncomes.reduce(function(carry, totalIncome) {
        return carry + parseFloat(totalIncome.account.amount);
      }, 0);
    },
    ExpenseTotal() {
      return this.totalExpenses.reduce(function(carry, totalExpense) {
        return carry + parseFloat(totalExpense.account.amount);
      }, 0);
    },
    BalanceTotal() {
      return this.IncomeTotal - parseFloat(this.ExpenseTotal);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      db.collection("incomes").onSnapshot(querySnapshot => {
        const incomes = [];
        querySnapshot.forEach(doc => {
          incomes.push(doc.data());
        });
        this.totalIncomes = incomes;
      }),
        db.collection("expenses").onSnapshot(querySnapshot => {
          const expenses = [];
          querySnapshot.forEach(doc => {
            expenses.push(doc.data());
          });
          this.totalExpenses = expenses;
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
        extends: Create,
        data() {
          return {
            animation: name
          };
        }
      });
    }
  }
};
</script>


<style>
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
