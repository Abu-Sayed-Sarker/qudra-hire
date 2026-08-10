import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId,
};

function isFirebaseConfigured() {
    return Object.values(firebaseConfig).every(Boolean);
}

export function getFirebaseAuth() {
    if (!isFirebaseConfigured()) {
        return null;
    }

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getAuth(app);
}

export function getGoogleProvider() {
    if (!isFirebaseConfigured()) {
        return null;
    }

    return new GoogleAuthProvider();
}