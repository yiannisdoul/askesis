import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

export interface FirebaseRuntimeConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function readConfig(): FirebaseRuntimeConfig | null {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '';
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '';
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '';
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '';
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '';

  if (!apiKey || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

const config = readConfig();

export const isFirebaseConfigured = config !== null;

export const DEFAULT_USER_ID =
  process.env.EXPO_PUBLIC_DEFAULT_USER_ID?.trim() || 'local-ascetic';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (config) {
  app = getApps().length ? getApp() : initializeApp(config);
  db = getFirestore(app);
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    throw new Error(
      'Firestore is not configured. Set EXPO_PUBLIC_FIREBASE_* env vars.',
    );
  }
  return db;
}

export function userPaths(userId: string) {
  return {
    profile: `users/${userId}/profile/main`,
    dailyLogs: `users/${userId}/daily_logs`,
    workoutLogs: `users/${userId}/workout_logs`,
    tradingLogs: `users/${userId}/trading_logs`,
  } as const;
}
