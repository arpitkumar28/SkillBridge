// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbWgTUhdvtf00UnvHOKz-_cqBrQggdBo4",
  authDomain: "skillbridge-90392.firebaseapp.com",
  projectId: "skillbridge-90392",
  storageBucket: "skillbridge-90392.appspot.com",
  messagingSenderId: "208543781402",
  appId: "1:208543781402:web:671bc3ebdf06fc6b18b7a3",
  measurementId: "G-DPPSFN4CLG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 