<template lang="html">
  <v-ons-page>
      <v-ons-list class="calendar">
        <v-ons-list-item>
          <v-date-picker mode='single' v-model='selectDate'>
            <b-field slot-scope='props' style="width: 100%">
              <b-input type='text' icon='calendar' :value='props.inputValue' @change.native='props.updateValue($event.target.value)' expanded>
              </b-input>
            </b-field>
          </v-date-picker>
        </v-ons-list-item>
        <v-ons-list-header>
          {{ selectDate | moment('DD - MMM - YYYY') }}
        </v-ons-list-header>
        <v-ons-list-item v-for="expense in expenses" :key="expense.id">
          <div class="center">
            <v-ons-row>
              <v-ons-col>
                {{ expense.account.description }}
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                {{ expense.account.amount }}
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right" v-if="expense.userId == currentUser.uid">
            <v-ons-icon icon="md-edit" @click="editExpense(animation, expense)"></v-ons-icon>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <v-ons-row>
              <v-ons-col>
                <strong>Total</strong>
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <strong>{{ total }}</strong>
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right">
            <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <hr>
      <v-ons-list style="padding-bottom: 80px;">
        <v-ons-list-header>
          {{ selectDate | moment('YYYY - MMMM') }}
        </v-ons-list-header>
        <v-ons-list-item v-for="expenseTotal in expenseTotals" :key="expenseTotal.name" v-if="expenseTotals[0].title != ''">
          <div class="center" v-show="expenseTotal.expenses != 0">
            <v-ons-row>
              <v-ons-col>
                {{ expenseTotal.title }}
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <span>{{ expenseTotal.expenses }}</span>
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right" v-show="expenseTotal.expenses != 0">
            <v-ons-icon icon="md-eye" @click="viewTitle(animation, expenseTotal.title, selectDate)"></v-ons-icon>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <v-ons-row>
              <v-ons-col>
                <strong>Total</strong>
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <strong>{{ monthlyTotal }}</strong>
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right">
            <v-ons-icon icon="md-check" class="icon-color"></v-ons-icon>
          </div>
        </v-ons-list-item>
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
import createAccount from "@/views/account/Create.vue";
import editAccount from "@/views/account/Edit.vue";
import ShowTitle from "@/views/account/ShowTitle.vue";
import Create from "@/views/account/Create.vue";
import Edit from "@/views/account/Edit.vue";
export default {
  components: { createAccount, editAccount },
  data() {
    return {
      animation: "default",
      date: new Date(Date.now()),
      selectDate: new Date(Date.now()),
      expenses: [],
      monthlyExpenses: [],
      expenseTotals: [
        {
          title: "",
          expenses: []
        }
      ],
      cashTitleTotals: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    total() {
      return this.expenses.reduce(function(carry, expense) {
        return carry + parseFloat(expense.account.amount);
      }, 0);
    },
    monthlyTotal() {
      return this.monthlyExpenses.reduce(function(carry, monthlyExpense) {
        return carry + parseFloat(monthlyExpense.account.amount);
      }, 0);
    }
  },
  watch: {
    selectDate() {
      if (this.selectDate != this.data) {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let queryMonth =
        this.selectDate.getFullYear() + "-" + this.selectDate.getMonth();
      let queryDay = this.selectDate.getDate();
      db
        .collection("expenses")
        .where("monthId", "==", queryMonth)
        .where("queryDay", "==", queryDay)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          const expenses = [];
          const expensesArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            expensesArray.push(doc.data());
            expensesArray[i].id = doc.id;
            expenses.push(expensesArray[i]);
            i++;
          });
          this.expenses = expenses;
        }),
        db
          .collection("expenses")
          .where("monthId", "==", queryMonth)
          .orderBy("createdOn", "desc")
          .onSnapshot(querySnapshot => {
            const expenses = [];
            const expensesArray = [];
            let i = 0;
            querySnapshot.forEach(doc => {
              expensesArray.push(doc.data());
              expensesArray[i].id = doc.id;
              expenses.push(expensesArray[i]);
              i++;
            });
            this.monthlyExpenses = expenses;
          }),
        db.collection("expense-titles").onSnapshot(querySnapshot => {
          let amountsArray = [];
          querySnapshot.forEach(doc => {
            let title = doc.data().name;
            db.collection("expenses")
              .where("monthId", "==", queryMonth)
              .where("title", "==", title)
              .orderBy("createdOn", "desc")
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
            this.expenseTotals = amountsArray;
          });
        }),
        db
          .collection("expenses")
          .where("monthId", "==", queryMonth)
          .orderBy("createdOn", "desc")
          .onSnapshot(querySnapshot => {
            const expenses = [];
            const expensesArray = [];
            let i = 0;
            querySnapshot.forEach(doc => {
              expensesArray.push(doc.data());
              expensesArray[i].id = doc.id;
              expenses.push(expensesArray[i]);
              i++;
            });
            this.cashTitleTotals = expenses;
          });
    },
    editExpense(name, expense) {
      let editExpenseData = expense;
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        accountData: editExpenseData,
        editDate: {
          date: new Date(editExpenseData.account.date.toDate())
        },
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: Edit,
        data() {
          return {
            animation: name,
            accountData: editExpenseData,
            editDate: {
              date: new Date(editExpenseData.account.date.toDate())
            },
            typeTitle: "Expense"
          };
        }
      });
    },
    viewTitle(name, title, date) {
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        title: title,
        selectDate: date,
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: ShowTitle,
        data() {
          return {
            animation: name,
            title: title,
            selectDate: date,
            collection: "expenses"
          };
        }
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

<style scoped>
.left {
  max-width: 100px;
}
.calendar {
  min-height: 400px;
}
</style>
