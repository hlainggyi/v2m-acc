<template lang="html">
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="selectProjectName.name">
    </custom-toolbar>
      <v-ons-list>
        <v-ons-list-item>
          <div class="center">
            <strong>
              <span style="padding-left:20px">Agree Amount</span>
            </strong>
          </div>
          <div class="right">
            <strong>{{ selectProjectName.amount }}</strong>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <hr>
      <v-ons-list>
        <v-ons-list-header>
          <strong>Income</strong>
        </v-ons-list-header>
        <v-ons-list-item v-for="incomeData in incomeDatas" :key="incomeData.id">
          <div class="left">
            {{ incomeData.account.date.toDate() | moment('DD - MMM') }}
          </div>
          <div class="center">
            <span style="padding-left:20px">{{ incomeData.account.description }}</span>
          </div>
          <div class="right">
            {{ incomeData.account.amount }}
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <strong>Total</strong>
          </div>
          <div class="right">
            <strong>{{ incomeTotal }}</strong>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <hr>
      <v-ons-list>
        <v-ons-list-header>
          <strong>Expense</strong>
        </v-ons-list-header>
        <v-ons-list-item v-for="expenseData in expenseDatas" :key="expenseData.id">
          <div class="left">
            {{ expenseData.account.date.toDate() | moment('DD - MMM') }}
          </div>
          <div class="center">
            <span style="padding-left:20px">{{ expenseData.account.description }}</span>
          </div>
          <div class="right">
            {{ expenseData.account.amount }}
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <strong>Total</strong>
          </div>
          <div class="right">
            <strong>{{ expenseTotal }}</strong>
          </div>
        </v-ons-list-item>
      </v-ons-list>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
import moment from "moment";
export default {
  data() {
    return {
      incomeDatas: [],
      expenseDatas: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    incomeTotal() {
      return this.incomeDatas.reduce(function(carry, incomeData) {
        return carry + parseFloat(incomeData.account.amount);
      }, 0);
    },
    expenseTotal() {
      return this.expenseDatas.reduce(function(carry, expenseData) {
        return carry + parseFloat(expenseData.account.amount);
      }, 0);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    getData() {
      db
        .collection("incomes")
        .where("projectId", "==", this.selectProjectName.id)
        .onSnapshot(querySnapshot => {
          const incomeDatas = [];
          const incomeDatasArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            incomeDatasArray.push(doc.data());
            incomeDatasArray[i].id = doc.id;
            incomeDatas.push(incomeDatasArray[i]);
            i++;
          });
          this.incomeDatas = incomeDatas;
        }),
        db
          .collection("expenses")
          .where("projectId", "==", this.selectProjectName.id)
          .onSnapshot(querySnapshot => {
            const expenseDatas = [];
            const expenseDatasArray = [];
            let i = 0;
            querySnapshot.forEach(doc => {
              expenseDatasArray.push(doc.data());
              expenseDatasArray[i].id = doc.id;
              expenseDatas.push(expenseDatasArray[i]);
              i++;
            });
            this.expenseDatas = expenseDatas;
          });
    }
  }
};
</script>

<style scoped>
.left {
  max-width: 100px;
}
</style>
