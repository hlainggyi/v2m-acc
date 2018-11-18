import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data())
    })

    // realtime updates from our posts collection
    fb.postsCollection.orderBy('createdOn', 'desc').limit(10).onSnapshot(querySnapshot => {
      // check if created by currentUser
      let createdByCurrentUser
      if (querySnapshot.docs.length) {
        // console.log(querySnapshot.docChanges())
        createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges()[0].doc.data().userId ? true : false
      }
      // add new posts to hiddenPosts array after initial load
      if (querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser) {

        let post = querySnapshot.docChanges()[0].doc.data()
        post.id = querySnapshot.docChanges()[0].doc.id

        store.commit('setHiddenPosts', post)
      } else {
        let postsArray = []

        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })

        store.commit('setPosts', postsArray)
      }
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: []
  },
  actions: {
    clearData({
      commit
    }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setPosts', null)
      commit('setHiddenPosts', null)
    },
    fetchUserProfile({
      commit,
      state
    }) {
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    },
    updateProfile({
      commit,
      state
    }, data) {
      let name = data.name
      let title = data.title
      let role = data.role
      let imageUrl = data.imageUrl

      fb.usersCollection.doc(state.currentUser.uid).update({
        name,
        title,
        role,
        imageUrl
      }).then(user => {
        // update all posts by user to reflect new name
        fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
              userName: name
            })
          })
        })
        // update all comments by user to reflect new name
        fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
              userName: name
            })
          })
        })
        // update all incomes by user to reflect new name
        fb.incomesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.incomesCollection.doc(doc.id).update({
              userName: name
            })
          })
        })
        // update all expenses by user to reflect new name
        fb.expensesCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.expensesCollection.doc(doc.id).update({
              userName: name
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setPosts(state, val) {
      if (val) {
        state.posts = val
      } else {
        state.posts = []
      }
    },
    setHiddenPosts(state, val) {
      if (val) {
        // make sure not to add duplicates
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val)
        }
      } else {
        state.hiddenPosts = []
      }
    }
  },
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {}
      },
      mutations: {
        push(state, page) {
          state.stack.push(page);
        },
        pop(state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        replace(state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        reset(state, page) {
          state.stack = [page || state.stack[0]];
        },
        options(state, newOptions = {}) {
          state.options = newOptions;
        }
      }
    },

    splitter: {
      strict: true,
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        }
      }
    },

    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 0
      },
      mutations: {
        set(state, index) {
          state.index = index;
        }
      }
    }
  }
})
