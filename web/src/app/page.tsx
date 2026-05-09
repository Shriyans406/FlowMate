"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/lib/store";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function Home() {
  const {
    workflows,
    executions,
    setWorkflows,
    setExecutions,
  } = useStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);

  const [stats, setStats] = useState<any>({
    total: 0,
    success: 0,
    failed: 0,
  });

  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  // FETCH DATA
  async function fetchData() {
    try {
      const wf = await axios.get("/api/workflow/list");
      const ex = await axios.get("/api/execution/list");

      setWorkflows(wf.data);
      setExecutions(ex.data);

      const statsRes = await axios.get("/api/analytics");

      setStats(statsRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // TRIGGER WORKFLOW
  async function triggerWorkflow() {
    try {
      setTriggerLoading(true);

      await fetch("/api/trigger/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger: "shopify_order",
        }),
      });

      alert("Workflow Triggered!");

      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error triggering workflow");
    } finally {
      setTriggerLoading(false);
    }
  }

  // CREATE AI WORKFLOW
  async function createAIWorkflow() {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      setPrompt("");

      alert("Workflow created successfully!");

      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error creating workflow");
    } finally {
      setLoading(false);
    }
  }

  // AUTH CHECK
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      fetchData();
    });

    return () => unsubscribe();
  }, []);

  // AUTO REFRESH EXECUTIONS
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // LOGOUT
  async function logout() {
    await signOut(auth);

    alert("Logged out");

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r z-50 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <span className="font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            FlowMate
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl flex items-center gap-3 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="font-medium">Workflows</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="font-medium">Analytics</span>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{user?.email?.[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-3 rounded-xl transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {user?.email?.split('@')[0]}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="p-3 glass rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              title="Refresh Data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button
              onClick={triggerWorkflow}
              disabled={triggerLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 active:scale-95"
            >
              {triggerLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {triggerLoading ? "Triggering..." : "Simulate Shopify Order"}
            </button>
          </div>
        </header>

        {/* BENTO GRID ANALYTICS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Platform Activity</span>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-lg font-bold">LIVE</span>
            </div>
            <div className="mt-8">
              <p className="text-5xl font-black text-slate-900 dark:text-white">{stats.total}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Total executions tracked</p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-l-4 border-l-emerald-500">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Successful</span>
            <p className="text-4xl font-black text-emerald-500 mt-4">{stats.success}</p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(stats.success / (stats.total || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-l-4 border-l-rose-500">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Failed</span>
            <p className="text-4xl font-black text-rose-500 mt-4">{stats.failed}</p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${(stats.failed / (stats.total || 1)) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* AI WORKFLOW SECTION */}
        <section className="magic-border-container shadow-2xl">
          <div className="bg-white dark:bg-[#0f172a] rounded-[calc(1rem-2px)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Generate Workflow with AI
              </h2>
            </div>

            <div className="relative group">
              <input
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 pr-32 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg placeholder:text-slate-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What automation should I build today?"
                onKeyDown={(e) => e.key === 'Enter' && createAIWorkflow()}
              />
              <button
                onClick={createAIWorkflow}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 rounded-xl font-bold transition flex items-center gap-2"
              >
                {loading ? "Thinking..." : "Generate"}
                {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
              Try: "When a new order comes in Shopify, notify the team on Slack"
            </p>
          </div>
        </section>

        {/* WORKFLOWS & EXECUTIONS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* WORKFLOWS LIST */}
          <section className="glass rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Your Workflows
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-full">
                  {workflows.length}
                </span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {workflows.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <p className="text-slate-500 font-medium">No workflows yet</p>
                  <p className="text-slate-400 text-sm">Use the AI generator to get started</p>
                </div>
              ) : (
                workflows.map((w: any) => (
                  <div
                    key={w._id}
                    className="group bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border dark:border-slate-700">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                          {w.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trigger</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{w.trigger}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-900/50">
                        {w.action}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* EXECUTIONS LIST */}
          <section className="glass rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Execution Logs
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
                  {executions.length}
                </span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {executions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-slate-500 font-medium">No activity yet</p>
                </div>
              ) : (
                executions.map((e: any) => (
                  <div
                    key={e._id}
                    className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-3 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workflow</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{e.workflowId}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                        "{e.log}"
                      </p>
                    </div>
                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${e.status === "success"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                          }`}
                      >
                        {e.status}
                      </span>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}