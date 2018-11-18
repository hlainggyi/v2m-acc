<template lang="html">
  <v-ons-page>
      <v-ons-list class="calendar">
        <v-ons-list-item>
          <v-date-picker mode='single' v-model='selectDate'>
            <b-field slot-scope='props'>
              <b-input type='text' icon='calendar' :value='props.inputValue' @change.native='props.updateValue($event.target.value)' expanded>
              </b-input>
            </b-field>
          </v-date-picker>
        </v-ons-list-item>
        <v-ons-list-header>
          {{ selectDate | moment('DD - MMM - YYYY') }}
        </v-ons-list-header>
        <v-ons-list-item v-for="income in incomes" :key="income.id">
          <div class="center">
            <v-ons-row>
              <v-ons-col>
                {{ income.account.description }}
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                {{ income.account.amount }}
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right" v-if="income.userId == currentUser.uid">
            <v-ons-icon icon="md-edit" @click="editIncome(animation, income)"></v-ons-icon>
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
        <v-ons-list-item v-for="incomeTotal in incomeTotals" :key="incomeTotal.name" v-if="incomeTotals[0].title != ''">
          <div class="center" v-show="incomeTotal.incomes != 0">
            <v-ons-row>
              <v-ons-col>
                {{ incomeTotal.title }}
              </v-ons-col>
              <v-ons-col width="100px" style="text-align: right; padding-right:5px">
                <span>{{ incomeTotal.incomes }}</span>
              </v-ons-col>
            </v-ons-row>
          </div>
          <div class="right" v-show="incomeTotal.incomes != 0">
            <v-ons-icon icon="md-eye" @click="viewTitle(animation, incomeTotal.title, selectDate)"></v-ons-icon>
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
      incomes: [],
      monthlyIncomes: [],
      incomeTotals: [
        {
          title: "",
          incomes: []
        }
      ],
      cashTitleTotals: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    total() {
      return this.incomes.reduce(function(carry, income) {
        return carry + parseFloat(income.account.amount);
      }, 0);
    },
    monthlyTotal() {
      return this.monthlyIncomes.reduce(function(carry, monthlyIncome) {
        return carry + parseFloat(monthlyIncome.account.amount);
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
  // waf
  methods: {
    getData() {
      let queryMonth =
        this.selectDate.getFullYear() + "-" + this.selectDate.getMonth();
      let queryDay = this.selectDate.getDate();
      db
        .collection("incomes")
        .where("monthId", "==", queryMonth)
        .where("queryDay", "==", queryDay)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          const incomes = [];
          const incomesArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            incomesArray.push(doc.data());
            incomesArray[i].id = doc.id;
            incomes.push(incomesArray[i]);
            i++;
          });
          this.incomes = incomes;
        }),
        db
          .collection("incomes")
          .where("monthId", "==", queryMonth)
          .orderBy("createdOn", "desc")
          .onSnapshot(querySnapshot => {
            const incomes = [];
            const incomesArray = [];
            let i = 0;
            querySnapshot.forEach(doc => {
              incomesArray.push(doc.data());
              incomesArray[i].id = doc.id;
              incomes.push(incomesArray[i]);
              i++;
            });
            this.monthlyIncomes = incomes;
          }),
        db.collection("income-titles").onSnapshot(querySnapshot => {
          let amountsArray = [];
          querySnapshot.forEach(doc => {
            let title = doc.data().name;
            db.collection("incomes")
              .where("monthId", "==", queryMonth)
              .where("title", "==", title)
              .orderBy("createdOn", "desc")
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
            this.incomeTotals = amountsArray;
          });
        }),
        db
          .collection("incomes")
          .where("Income", "==", queryMonth)
          .orderBy("createdOn", "desc")
          .onSnapshot(querySnapshot => {
            const incomes = [];
            const incomesArray = [];
            let i = 0;
            querySnapshot.forEach(doc => {
              incomesArray.push(doc.data());
              incomesArray[i].id = doc.id;
              incomes.push(incomesArray[i]);
              i++;
            });
            this.cashTitleTotals = incomes;
          });
    },
    editIncome(name, income) {
      // let date = new Date(income.account.date.toDate())
      let editIncomeData = income;
      this.$store.commit("navigator/options", {
        // Sets animations
        animation: name,
        accountData: editIncomeData,
        editDate: {
          date: new Date(editIncomeData.account.date.toDate())
        },
        // Resets default options
        callback: () => this.$store.commit("navigator/options", {})
      });
      this.$store.commit("navigator/push", {
        extends: Edit,
        data() {
          return {
            animation: name,
            accountData: editIncomeData,
            editDate: {
              date: new Date(editIncomeData.account.date.toDate())
            },
            typeTitle: "Income"
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
            collection: "incomes"
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
  min-height: 350px;
}
</style>
