"use client";

import { useState } from "react";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signup() {
        try {
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Account created!");

            router.push("/");
        } catch (err: any) {
            alert(err.message);
        }
    }

    async function login() {
        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Login successful!");

            router.push("/");
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow w-[400px]">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    FlowMate Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded w-full mb-4"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded w-full mb-6"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <div className="flex gap-3">
                    <button
                        onClick={login}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Login
                    </button>

                    <button
                        onClick={signup}
                        className="bg-green-500 text-white px-4 py-2 rounded w-full"
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    );
}