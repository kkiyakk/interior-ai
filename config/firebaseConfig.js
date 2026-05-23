import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCic786-Y84qoWv_UQYnG3aFQ9192_N7PE",
  authDomain: "interior-ai-b3572.firebaseapp.com",
  projectId: "interior-ai-b3572",
  storageBucket: "interior-ai-b3572.firebasestorage.app",
  messagingSenderId: "281399891901",
  appId: "1:281399891901:web:f277937f539b1cb60aa4d4",
  measurementId: "G-828S15FZS4",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);