import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration for tipa-task-manager project
const firebaseConfig = {
  apiKey: "AIzaSyBgDuPin7aSOBfkmA0ENpiiQZAbbj_Fl4g",
  authDomain: "tipa-task-manager.firebaseapp.com",
  projectId: "tipa-task-manager",
  storageBucket: "tipa-task-manager.firebasestorage.app",
  messagingSenderId: "529094386000",
  appId: "1:529094386000:web:223840a2126ab0b1a88c55",
} as const;

let app;
let db: Firestore | null = null;

let auth: any = null;

try {
  // Avoid re-initializing in dev/hot-reload
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  if (process.env.NODE_ENV === 'development') {
    console.log("✅ Firebase initialized successfully");
    console.log("📋 Project ID:", firebaseConfig.projectId);
  }
  
  // Опционально: автоматическая анонимная аутентификация
  // Раскомментируйте, если используете firestore.rules.anonymous
  /*
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth)
        .then(() => console.log("✅ Anonymous authentication successful"))
        .catch((err) => console.warn("⚠️ Anonymous auth failed (using public rules):", err));
    }
  });
  */
} catch (error) {
  console.error("❌ Firebase initialization failed, falling back to static data.", error);
}

export { db, auth };