import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAsLjznsd2ueiOp-gZtBRAQShkKWXkiVSU",
  authDomain: "tast8offullstack.firebaseapp.com",
  projectId: "tast8offullstack",
  storageBucket: "tast8offullstack.appspot.com",
  messagingSenderId: "803072122049",
  appId: "1:803072122049:web:21636a515d697f66a04840"
};

const app = initializeApp(firebaseConfig);
const imageUpload = getStorage(app);
const postUpload = getFirestore(app);

const exportfirebase = {
  imageUpload,
  postUpload
};
export default exportfirebase;