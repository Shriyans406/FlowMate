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
    const [isLoading, setIsLoading] = useState(false);

    async function signup() {
        try {
            setIsLoading(true);
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Account created!");

            router.push("/");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function login() {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Login successful!");

            router.push("/");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-4 relative overflow-hidden">
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />

            <div className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-[480px] shadow-2xl relative z-10 border border-white/20 dark:border-white/5">
                
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-6 transform -rotate-6">
                        <span className="font-bold text-3xl">F</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        FlowMate
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Automate your world with AI
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-10">
                    <button
                        onClick={login}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
                    </button>

                    <button
                        onClick={signup}
                        disabled={isLoading}
                        className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 transition-all active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </div>

                <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-8">
                    By continuing, you agree to our Terms and Privacy Policy.
                </p>
            </div>
        </div>
    );
}