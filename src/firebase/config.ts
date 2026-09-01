import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

// Firebase configuration from firebase-applet-config.json with environment fallbacks
export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || (import.meta as any).env?.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseConfigData.authDomain || (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseConfigData.projectId || (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseConfigData.storageBucket || (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseConfigData.messagingSenderId || (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseConfigData.appId || (import.meta as any).env?.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database (using configured custom databaseId if present)
const databaseId = firebaseConfigData.firestoreDatabaseId;
export const db: Firestore = databaseId 
  ? getFirestore(app, databaseId) 
  : getFirestore(app);

