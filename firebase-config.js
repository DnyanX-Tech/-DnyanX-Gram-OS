// ==========================================
// DnyanX Gram-OS - Firebase Configuration
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDcslvgu1WSKLkmuPW5WcUEgLcFO4pjZfs",
  authDomain: "dnyanx-gramos.firebaseapp.com",
  projectId: "dnyanx-gramos",
  storageBucket: "dnyanx-gramos.firebasestorage.app",
  messagingSenderId: "473550420352",
  appId: "1:473550420352:web:5d89d419583953109f2965",
  measurementId: "G-C8BYRRFVM5"
};

// Initialize Firebase for Vanilla / Browser environment
let app, analytics, db, auth;

try {
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    if (firebase.analytics) analytics = firebase.analytics();
    
    // Attach to global window
    window.db = db;
    window.fbDb = db;
    window.fbAuth = auth;
    window.fbApp = app;
    console.log("🔥 [firebase-config.js] Firebase & Firestore DB successfully initialized!");
  }
} catch (e) {
  console.warn("[firebase-config.js] Initialization notice:", e);
}
