import firebase from "firebase";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";

// firebase init goes here
const config = {
  // V2M
  apiKey: "AIzaSyB2oSV342i_a5hcatx0Sv_ic21mDrve1s4",
  authDomain: "v2m-acc.firebaseapp.com",
  databaseURL: "https://v2m-acc.firebaseio.com",
  projectId: "v2m-acc",
  storageBucket: "v2m-acc.appspot.com",
  messagingSenderId: "835544497960"

  // // Dev
  // apiKey: "AIzaSyBP5rwoQ9bfMShvKUiUnVDZzKPOgmtNStI",
  // authDomain: "kopin88-pro-acc.firebaseapp.com",
  // databaseURL: "https://kopin88-pro-acc.firebaseio.com",
  // projectId: "kopin88-pro-acc",
  // storageBucket: "kopin88-pro-acc.appspot.com",
  // messagingSenderId: "87215343909"
};
firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");
const incomesCollection = db.collection("incomes");
const expensesCollection = db.collection("expenses");

export {
  db,
  auth,
  storage,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  incomesCollection,
  expensesCollection
};
