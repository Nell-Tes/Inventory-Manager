// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkKyrCTHOglgfIm112J7Tpr9komw8I1Ec",
  authDomain: "inventory-management-aa046.firebaseapp.com",
  projectId: "inventory-management-aa046",
  storageBucket: "inventory-management-aa046.appspot.com",
  messagingSenderId: "689768086601",
  appId: "1:689768086601:web:ea390716e087229801d398",
  measurementId: "G-P6QGTMHQNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};