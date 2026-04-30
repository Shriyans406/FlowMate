import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import mongoose from "mongoose";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables. Make sure .env.local is in the web directory.");
    }
    
    if (mongoose.connection.readyState === 1) return;
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}