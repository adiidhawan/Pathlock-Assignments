import { useState, useEffect } from "react"
import ShaderBackground from "./components/ShaderBackground"
import { getTasks, createTask, updateTask, deleteTask } from "./services/api"
import type { TaskItem } from "./types/TaskItem"
import "./App.css"

type FilterType = "all" | "pending" | "completed"

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const r = await getTasks()
      setTasks(r.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAdd = async () => {
    if (!newTaskDesc.trim()) return
    await createTask(newTaskDesc)
    setNewTaskDesc("")
    loadTasks()
  }

  const handleToggle = async (id: string, isCompleted: boolean) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, isCompleted: !isCompleted } : t)))
    try {
      await updateTask(id, !isCompleted)
    } catch (e) {
      console.error(e)
      loadTasks()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const filtered = tasks.filter(t => (filter === "all" ? true : filter === "pending" ? !t.isCompleted : t.isCompleted))

  return (
    <ShaderBackground>
      <div className="app-outer">
        <div className="container large-center">
          <div className="card large-card">
            <div className="header">
              <h1>Welcome to your Task Manager</h1>
              <p className="subtitle">Make use of your to-do list</p>
            </div>

            <div className="add-task">
              <input
                type="text"
                placeholder="Enter a new task..."
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              <button className="btn-add" onClick={handleAdd}>
                Add
              </button>
            </div>

            <div className="filter-tabs">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                All
              </button>
              <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>
                Pending
              </button>
              <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
                Completed
              </button>
            </div>

            <div className="tasks-section">
              {filtered.length === 0 ? (
                <div className="empty-state">No tasks yet. Add one above.</div>
              ) : (
                <ul className="task-list">
                  {filtered.map(t => (
                    <li key={t.id} className={t.isCompleted ? "completed" : ""}>
                      <div className="task-left">
                        <input type="checkbox" checked={t.isCompleted} onChange={() => handleToggle(t.id, t.isCompleted)} />
                        <div className="task-content">
                          <div className="task-description">{t.description}</div>
                          <div className="task-meta">
                            {new Date(t.createdAt).toLocaleString()}
                            {t.updatedAt ? ` • Updated ${new Date(t.updatedAt).toLocaleString()}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="task-right">
                        <span className={`status-badge ${t.isCompleted ? "completed" : "pending"}`}>
                          {t.isCompleted ? "Completed" : "Pending"}
                        </span>
                        <button className="btn-delete" onClick={() => handleDelete(t.id)}>
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
