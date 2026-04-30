import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import mongoose from "mongoose";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(MONGODB_URI);
}