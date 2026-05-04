"use client";

import { useEffect } from "react";
import axios from "axios";
import { useStore } from "@/lib/store";

import { useState } from "react";

export default function Home() {
  const {
    workflows,
    executions,
    setWorkflows,
    setExecutions,
  } = useStore();

  async function fetchData() {
    const wf = await axios.get("/api/workflow/list");
    const ex = await axios.get("/api/execution/list");

    setWorkflows(wf.data);
    setExecutions(ex.data);
  }

  async function triggerWorkflow() {
    await fetch("/api/trigger/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trigger: "shopify_order",
      }),
    });

    alert("Triggered!");
  }

  useEffect(() => {
    fetchData();
  }, []);


  const [prompt, setPrompt] = useState("");

  async function createAIWorkflow() {
    await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    alert("Workflow created!");
  }



  return (

    <div style={{ padding: "20px" }}>
      <h1>FlowMate Dashboard</h1>

      <button onClick={triggerWorkflow}>
        Trigger Shopify Workflow
      </button>

      <h2>Create Workflow (AI)</h2>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type instruction..."
      />

      <button onClick={createAIWorkflow}>
        Generate Workflow
      </button>

      <h2>Workflows</h2>
      <ul>
        {workflows.map((w: any) => (
          <li key={w._id}>
            {w.name} - {w.trigger} → {w.action}
          </li>
        ))}
      </ul>

      <h2>Executions</h2>
      <ul>
        {executions.map((e: any) => (
          <li key={e._id}>
            {e.workflowId} - {e.status} - {e.log}
          </li>
        ))}
      </ul>
    </div>
  );
}