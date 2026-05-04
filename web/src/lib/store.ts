import { create } from "zustand";

type Store = {
    workflows: any[];
    executions: any[];
    setWorkflows: (data: any[]) => void;
    setExecutions: (data: any[]) => void;
};

export const useStore = create<Store>((set) => ({
    workflows: [],
    executions: [],
    setWorkflows: (data) => set({ workflows: data }),
    setExecutions: (data) => set({ executions: data }),
}));