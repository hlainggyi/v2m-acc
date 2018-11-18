<template>
  <v-ons-page>
    <custom-toolbar :style="swipeTheme" modifier="white-content">
      {{ title }}
      <v-ons-toolbar-button slot="left" modifier="white-content"
        @click="$store.commit('splitter/toggle')"
      >
        <v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
      </v-ons-toolbar-button>
    </custom-toolbar>

    <v-ons-tabbar position="auto"
      swipeable
      :modifier="md ? 'autogrow white-content' : ''"
      :on-swipe="md ? onSwipe : null"
      :tabbar-style="swipeTheme"
      :tabs="tabs"
      :index.sync="index"
    ></v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import Home from "@/views/account/Index.vue";
import Income from "@/views/account/Income.vue";
import Expense from "@/views/account/Expense.vue";
import Project from "@/views/account/ProjectList.vue";

// Just a linear interpolation formula
const lerp = (x0, x1, t) => parseInt((1 - t) * x0 + t * x1, 10);
// RGB colors
const red = [244, 67, 54];
const blue = [30, 136, 229];
const purple = [103, 58, 183];

export default {
  data() {
    return {
      shutUp: !this.md,
      showingTip: false,
      colors: red,
      animationOptions: {},
      topPosition: 0,
      tabs: [
        // {
        //   label: this.md ? null : 'Camera',
        //   icon: 'ion-camera, material:md-camera',
        //   page: Camera,
        //   theme: blue,
        //   // style: this.md ? { maxWidth: '60px' } : {},
        //   // top: -105 // Toolbar + Tabbar heights
        // },
        {
          label: "V2M",
          // icon: this.md ? null : 'ion-home',
          icon: "fa-home, material:fa-home",
          page: Home,
          theme: blue
        },
        {
          label: "Income",
          // icon: this.md ? null : 'ion-home',
          icon: "fa-chart-line, material:fa-chart-line",
          page: Income,
          theme: blue
        },
        {
          label: "Expense",
          // icon: this.md ? null : 'ion-home',
          icon: "fa-chart-line, material:fa-chart-line",
          page: Expense,
          theme: blue
        },
        {
          label: "Project",
          // icon: this.md ? null : 'ion-home',
          icon: "fa-project-diagram, material:fa-project-diagram",
          page: Project,
          theme: blue
        }
        // {
        //   label: 'Forms',
        //   icon: this.md ? null : 'ion-edit',
        //   page: Forms,
        //   theme: blue
        // },
        // {
        //   label: 'Anim',
        //   icon: this.md ? null : 'ion-film-marker',
        //   page: Animations,
        //   theme: blue
        // }
      ]
    };
  },

  methods: {
    onSwipe(index, animationOptions) {
      // Apply the same transition as ons-tabbar
      this.animationOptions = animationOptions;

      // Interpolate colors and top position
      const a = Math.floor(index),
        b = Math.ceil(index),
        ratio = index % 1;
      this.colors = this.colors.map((c, i) =>
        lerp(this.tabs[a].theme[i], this.tabs[b].theme[i], ratio)
      );
      this.topPosition = lerp(
        this.tabs[a].top || 0,
        this.tabs[b].top || 0,
        ratio
      );
    }
  },

  computed: {
    index: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        this.$store.commit("tabbar/set", newValue);
      }
    },
    title() {
      return this.md
        ? "V2M COMPANY LIMITED"
        : this.tabs[this.index].title || this.tabs[this.index].label;
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
  }
};
</script>

<style>
/* Custom 'white-content' modifier */

.page--material .toolbar--white-content__center,
.page--material .toolbar-button--white-content,
.page--material :checked + .tabbar--white-content__button {
  color: white;
}

.page--material .tabbar--white-content__button {
  color: rgba(255, 255, 255, 0.7);
}

.page--material .tabbar--white-content__border {
  background-color: white;
}
</style>
