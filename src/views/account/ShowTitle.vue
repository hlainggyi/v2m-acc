<template lang="html">
  <v-ons-page>
    <custom-toolbar backLabel="Back" :title="title">
    </custom-toolbar>
      <v-ons-list>
        <v-ons-list-header>
          {{ selectDate | moment('YYYY - MMMM') }}
        </v-ons-list-header>
        <v-ons-list-item v-for="accountData in accountDatas" :key="accountData.id">
          <div class="left">
            {{ accountData.account.date.toDate() | moment('DD - MMM') }}
          </div>
          <div class="center">
            <span style="padding-left:20px">{{ accountData.account.description }}</span>
          </div>
          <div class="right">
            {{ accountData.account.amount }}
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <strong>Total</strong>
          </div>
          <div class="right">
            <strong>{{ total }}</strong>
          </div>
        </v-ons-list-item>
      </v-ons-list>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
import { db } from "@/firebaseConfig";
import moment from "moment";
const green = [67, 160, 71];
export default {
  data() {
    return {
      colors: green,
      animationOptions: {},
      accountDatas: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    total() {
      return this.accountDatas.reduce(function(carry, accountData) {
        return carry + parseFloat(accountData.account.amount);
      }, 0);
    },
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
    this.getData();
  },
  methods: {
    md() {
      return this.$ons.platform.isAndroid();
    },
    getData() {
      let queryMonth =
        this.selectDate.getFullYear() + "-" + this.selectDate.getMonth();
      db.collection(this.collection)
        .where("monthId", "==", queryMonth)
        .where("title", "==", this.title)
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          const accountDatas = [];
          const accountDatasArray = [];
          let i = 0;
          querySnapshot.forEach(doc => {
            accountDatasArray.push(doc.data());
            accountDatasArray[i].id = doc.id;
            accountDatas.push(accountDatasArray[i]);
            i++;
          });
          this.accountDatas = accountDatas;
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
