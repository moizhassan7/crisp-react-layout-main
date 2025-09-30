import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // For database operations
import { getStorage } from 'firebase/storage'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ5zN0Nv_JoE8ctl4bqvGpXVp9b2tFpVE",
  authDomain: "swtich2itech.firebaseapp.com",
  projectId: "swtich2itech",
  storageBucket: "swtich2itech.firebasestorage.app",
  messagingSenderId: "728180062398",
  appId: "1:728180062398:web:6920e16206b29d335c86ef",
  measurementId: "G-NG1F8Y8KL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // For Firestore database
const storage = getStorage(app); // For Firebase Storage (images)

export { app, auth, db, storage };