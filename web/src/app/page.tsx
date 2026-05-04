"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/lib/store";

export default function Home() {
  const {
    workflows,
    executions,
    setWorkflows,
    setExecutions,
  } = useStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      const wf = await axios.get("/api/workflow/list");
      const ex = await axios.get("/api/execution/list");

      setWorkflows(wf.data);
      setExecutions(ex.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  async function triggerWorkflow() {
    try {
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
      fetchData(); // refresh UI
    } catch (err) {
      console.error(err);
      alert("Error triggering workflow");
    }
  }

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

      fetchData(); // refresh workflows
    } catch (err) {
      console.error(err);
      alert("Error creating workflow");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        FlowMate Dashboard
      </h1>

      {/* AI SECTION */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Create Workflow (AI)
        </h2>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type instruction..."
          />

          <button
            onClick={createAIWorkflow}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* TRIGGER BUTTON */}
      <div className="mb-6 text-center">
        <button
          onClick={triggerWorkflow}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Trigger Shopify Workflow
        </button>
      </div>

      {/* WORKFLOWS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Workflows
        </h2>

        <ul className="space-y-2">
          {workflows.map((w: any) => (
            <li
              key={w._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <span className="font-medium text-gray-800">
                {w.name}
              </span>

              <span className="text-gray-500 text-sm">
                {w.trigger} → {w.action}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* EXECUTIONS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Executions
        </h2>

        <ul className="space-y-2">
          {executions.map((e: any) => (
            <li
              key={e._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <span className="text-sm text-gray-700">
                {e.workflowId}
              </span>

              <span
                className={`text-sm font-semibold ${e.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {e.status}
              </span>

              <span className="text-gray-500 text-sm">
                {e.log}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}