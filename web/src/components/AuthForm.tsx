"use client";

import { useState } from "react";
import { auth } from "@/lib/db";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signUp() {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Signup successful!");
        } catch (err: any) {
            alert(err.message);
        }
    }

    async function login() {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div style={{ marginTop: "20px" }}>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={signUp}>Sign Up</button>
            <button onClick={login}>Login</button>
        </div>
    );
}