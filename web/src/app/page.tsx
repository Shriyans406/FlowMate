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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            FlowMate Dashboard
          </h1>

          <p className="text-gray-600 mt-1">
            Welcome {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-2xl shadow p-6 border">
          <h2 className="text-gray-500 text-sm mb-2">
            Total Executions
          </h2>

          <p className="text-3xl font-bold text-gray-800">
            {stats.total}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border">
          <h2 className="text-gray-500 text-sm mb-2">
            Successful
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {stats.success}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border">
          <h2 className="text-gray-500 text-sm mb-2">
            Failed
          </h2>

          <p className="text-3xl font-bold text-red-500">
            {stats.failed}
          </p>
        </div>
      </div>

      {/* AI WORKFLOW SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border">

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create Workflow with AI
        </h2>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: When Shopify order happens send Slack message"
          />

          <button
            onClick={createAIWorkflow}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <button
          onClick={triggerWorkflow}
          disabled={triggerLoading}
          className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition disabled:bg-gray-400"
        >
          {triggerLoading
            ? "Triggering..."
            : "Trigger Shopify Workflow"}
        </button>

        <button
          onClick={fetchData}
          className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-black transition"
        >
          Refresh Dashboard
        </button>
      </div>

      {/* WORKFLOWS */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-semibold text-gray-800">
            Workflows
          </h2>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {workflows.length} workflows
          </span>
        </div>

        {workflows.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No workflows found
          </div>
        ) : (
          <ul className="space-y-4">
            {workflows.map((w: any) => (
              <li
                key={w._id}
                className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {w.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Trigger: {w.trigger}
                  </p>
                </div>

                <div className="mt-3 md:mt-0">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {w.action}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* EXECUTIONS */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-semibold text-gray-800">
            Executions
          </h2>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {executions.length} logs
          </span>
        </div>

        {executions.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No execution logs found
          </div>
        ) : (
          <ul className="space-y-4">
            {executions.map((e: any) => (
              <li
                key={e._id}
                className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Workflow ID:
                  </p>

                  <p className="text-sm text-gray-500 break-all">
                    {e.workflowId}
                  </p>
                </div>

                <div className="mt-3 md:mt-0 flex flex-col md:items-end gap-2">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${e.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {e.status}
                  </span>

                  <p className="text-sm text-gray-500">
                    {e.log}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}