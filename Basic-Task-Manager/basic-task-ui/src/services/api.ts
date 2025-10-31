import axios from 'axios';
import type { TaskItem } from '../types/TaskItem';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5097';
const API_URL = `${API_BASE}/api/tasks`;

export const getTasks = () => axios.get<TaskItem[]>(API_URL);

export const createTask = (description: string) =>
  axios.post<TaskItem>(API_URL, { description, isCompleted: false });

export const updateTask = (id: string, isCompleted: boolean) =>
  axios.put(`${API_URL}/${id}`, { isCompleted }, {
    headers: { 'Content-Type': 'application/json' },
  });

export const deleteTask = (id: string) => axios.delete(`${API_URL}/${id}`);
