import { axiosClient } from './axiosClient';

export type OperationTeam = 'lqt' | 'sales' | 'procurement';

export type OperationRow = {
  id: string;
  source: 'quote' | 'operation';
  account: string;
  owner: string;
  detail: string;
  status: string;
  quoteStatus?: string;
  next: string;
  value: string;
  assignedTeam?: string;
  leadTemperature?: string;
  requirement?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OperationsDashboard = {
  team: OperationTeam;
  rows: OperationRow[];
  counts: Record<string, unknown>;
  modules: Record<string, number>;
};

export const operationsApi = {
  async getDashboard(team: OperationTeam) {
    const res = await axiosClient.get<OperationsDashboard>(`/operations/${team}/dashboard`);
    return res.data;
  },

  async updateQuote(team: 'lqt' | 'sales', id: string, payload: Record<string, unknown>) {
    const res = await axiosClient.patch(`/operations/${team}/quotes/${id}`, payload);
    return res.data;
  },

  async createRecord(team: 'sales' | 'procurement', payload: Record<string, unknown>) {
    const res = await axiosClient.post(`/operations/${team}/records`, payload);
    return res.data;
  },

  async updateRecord(team: 'sales' | 'procurement', id: string, payload: Record<string, unknown>) {
    const res = await axiosClient.patch(`/operations/${team}/records/${id}`, payload);
    return res.data;
  },
};
