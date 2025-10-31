import React, { useEffect, useState } from "react";
import axios from "axios";
import ShaderBackground from "./components/ShaderBackground";

const api = axios.create({ baseURL: "/api" });

function extractError(err) {
  if (!err) return "Unknown error";
  if (err.response) {
    const d = err.response.data;
    if (d && typeof d === "object") {
      if (d.message) return `${d.message} (status ${err.response.status})`;
      if (d.title && d.status) return `${d.title} (status ${d.status})`;
      return `${JSON.stringify(d)} (status ${err.response.status})`;
    }
    return `${err.response.status} ${err.response.statusText || ""}`;
  }
  return err.message || String(err);
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("pm_token") || "");
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [addingTaskFor, setAddingTaskFor] = useState(null);
  const [schedulerResult, setSchedulerResult] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("pm_token") || token;
    if (t) api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    else delete api.defaults.headers.common["Authorization"];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("pm_token", token);
      fetchProjects();
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("pm_token");
      setProjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function register() {
    setMessage("");
    if (!form.email || !form.password || !form.fullName) {
      setMessage("All register fields required");
      return;
    }
    try {
      setLoading(true);
      await api.post("/Auth/register", { email: form.email, password: form.password, fullName: form.fullName });
      setMessage("Registered. Now log in.");
      setForm({ ...form, password: "" });
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setMessage("");
    if (!form.email || !form.password) {
      setMessage("Email & password required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/Auth/login", { email: form.email, password: form.password });
      const tok = res?.data?.token;
      if (!tok) {
        setMessage("Login didn't return token");
        return;
      }
      setToken(tok);
      setForm({ email: "", password: "", fullName: "" });
      setMessage("");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    setMessage("");
    try {
      setLoading(true);
      const listRes = await api.get("/Projects");
      const list = listRes.data || [];
      const detailPromises = list.map(async (p) => {
        try {
          const r = await api.get(`/Projects/${p.id}`);
          return r.data;
        } catch {
          return { ...p, tasks: [] };
        }
      });
      const full = await Promise.all(detailPromises);
      setProjects(full);
    } catch (err) {
      setMessage("Could not fetch projects — " + extractError(err));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    const title = (projectForm.title || "").trim();
    if (!title) {
      setMessage("Title required");
      return;
    }
    if (title.length < 3) {
      setMessage("Title must be at least 3 characters long");
      return;
    }
    try {
      setLoading(true);
      await api.post("/Projects", { title, description: projectForm.description || "" });
      setProjectForm({ title: "", description: "" });
      await fetchProjects();
      setMessage("Project created");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(projectId) {
    if (!confirm("Delete project?")) return;
    try {
      setLoading(true);
      await api.delete(`/Projects/${projectId}`);
      await fetchProjects();
      setMessage("Project deleted");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function submitAddTask(projectId, title) {
    const trimmed = (title || "").trim();
    if (!trimmed) {
      setMessage("Task title required");
      return;
    }
    try {
      setLoading(true);
      await api.post(`/Projects/${projectId}/Tasks`, { title: trimmed, dueDate: null });
      setAddingTaskFor(null);
      const projectRes = await api.get(`/Projects/${projectId}`);
      setProjects((prev) => prev.map(p => (p.id === projectId ? projectRes.data : p)));
      setMessage("Task added successfully");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function updateTask(projectId, taskId, fields) {
    try {
      setLoading(true);
      await api.put(`/Projects/${projectId}/Tasks/${taskId}`, fields);
      const projectRes = await api.get(`/Projects/${projectId}`);
      setProjects((prev) => prev.map(p => (p.id === projectId ? projectRes.data : p)));
      setMessage("Task updated");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(projectId, task) {
    try {
      setLoading(true);
      await api.put(`/Projects/${projectId}/Tasks/${task.id}`, {
        title: task.title,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted
      });
      const projectRes = await api.get(`/Projects/${projectId}`);
      setProjects((prev) => prev.map(p => (p.id === projectId ? projectRes.data : p)));
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(projectId, taskId) {
    try {
      setLoading(true);
      await api.delete(`/Projects/${projectId}/Tasks/${taskId}`);
      const projectRes = await api.get(`/Projects/${projectId}`);
      setProjects((prev) => prev.map(p => (p.id === projectId ? projectRes.data : p)));
      setMessage("Task deleted");
    } catch (err) {
      setMessage(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setProjects([]);
    setMessage("");
  }

  async function runSchedulerFromProject(project) {
    setSchedulerResult(null);
    setMessage("");
    try {
      setLoading(true);
      const payload = {
        tasks: (project.tasks || []).map(t => ({
          title: t.title,
          estimatedHours: 1,
          dueDate: t.dueDate,
          dependencies: []
        }))
      };
      const res = await api.post(`/Projects/${project.id}/Schedule`, payload);
      setSchedulerResult(res.data);
    } catch (err) {
      setMessage("Scheduler error: " + extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function runSchedulerWithCustomPayload(project) {
    const txt = prompt('Paste scheduler JSON payload here (example: { "tasks": [{ "title": "A", "estimatedHours": 1 }] })');
    if (!txt) return;
    try {
      setLoading(true);
      const payload = JSON.parse(txt);
      const res = await api.post(`/Projects/${project.id}/Schedule`, payload);
      setSchedulerResult(res.data);
    } catch (err) {
      setMessage("Scheduler error: " + extractError(err));
    } finally {
      setLoading(false);
    }
  }

  const IconPencil = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff7b7b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
  const IconCheck = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
  const IconCross = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
  const IconCircle = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  return (
    <ShaderBackground>
      <div className="app-outer">
        <div className="container">
          <div className="card">
            <div className="header">
              <h1>Welcome to your Smart Project Handler</h1>
              <p className="subtitle">Add your project and assign tasks relate to it</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="small-btn" onClick={() => fetchProjects()} disabled={loading}>Refresh</button>
                {token ? <button className="small-btn danger" onClick={logout}>Logout</button> : null}
              </div>
            </div>

            {message && <div className="message">{message}</div>}

            {!token ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <h3 style={{ marginBottom: 8 }}>Register</h3>
                  <input className="input" placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                  <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <div style={{ marginTop: 8 }}>
                    <button className="btn-primary" onClick={register} disabled={loading}>{loading ? "..." : "Register"}</button>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: 8 }}>Login</h3>
                  <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <div style={{ marginTop: 8 }}>
                    <button className="btn-primary" onClick={login} disabled={loading}>{loading ? "..." : "Login"}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <section style={{ marginBottom: 18 }}>
                  <h3>Create Project</h3>
                  <input className="input" placeholder="Title (min 3 chars)" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                  <textarea className="textarea" placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                  <div>
                    <button className="btn-primary" onClick={createProject} disabled={loading}>{loading ? "..." : "Create"}</button>
                  </div>
                </section>

                <section>
                  <h3>Your Projects</h3>
                  <div>
                    {projects.length === 0 && <div className="muted">No projects yet</div>}
                    {projects.map(p => (
                      <div key={p.id} className="project-box" style={{ position: "relative" }}>
                        <div className="project-left">
                          <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
                          <div style={{ color: "#aaa", marginBottom: 8 }}>{p.description}</div>

                          <ul className="task-list">
                            {(p.tasks || []).map(t => (
                              <li key={t.id} className="task-row" style={{ position: "relative" }}>
                                <div className="task-left">
                                  <button
                                    className={`circle-btn ${t.isCompleted ? "completed" : ""}`}
                                    onClick={() => toggleTask(p.id, t)}
                                    aria-label={t.isCompleted ? "Mark incomplete" : "Mark complete"}
                                    title={t.isCompleted ? "Mark incomplete" : "Mark complete"}
                                    type="button"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {t.isCompleted ? <IconCheck /> : <IconCircle />}
                                  </button>

                                  <div className={`task-title ${t.isCompleted ? "completed" : ""}`} style={{ marginLeft: 8 }}>
                                    {t.title}
                                  </div>
                                </div>

                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <button className="icon-btn" onClick={() => toggleTask(p.id, t)} aria-label="toggle-small">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.isCompleted ? "#ff2d2d" : "#888"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  </button>

                                  <button className="icon-btn" title="Edit" onClick={() => {
                                    const newTitle = prompt("Rename task", t.title);
                                    if (newTitle != null) {
                                      const trimmed = newTitle.trim();
                                      if (!trimmed) { alert("Title required"); return; }
                                      updateTask(p.id, t.id, { title: trimmed, dueDate: t.dueDate, isCompleted: t.isCompleted });
                                    }
                                  }}><IconPencil /></button>

                                  <button className="icon-btn danger" title="Delete" onClick={() => { if (confirm("Delete task?")) deleteTask(p.id, t.id); }}>
                                    <IconCross />
                                  </button>
                                </div>
                              </li>
                            ))}

                            <li style={{ marginTop: 8 }}>
                              {addingTaskFor === p.id ? (
                                <AddTaskInline onSave={(title) => submitAddTask(p.id, title)} onCancel={() => setAddingTaskFor(null)} />
                              ) : (
                                <div style={{ marginTop: 8 }}>
                                  <button className="small-btn" onClick={() => setAddingTaskFor(p.id)}>Add Task</button>
                                  <button className="small-btn" onClick={() => deleteProject(p.id)}>Delete Project</button>
                                  <button className="small-btn" onClick={() => runSchedulerFromProject(p)}>Run Scheduler</button>
                                  <button className="small-btn" onClick={() => runSchedulerWithCustomPayload(p)}>Scheduler: custom payload</button>
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>

                        <div className="project-meta">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ marginTop: 16 }}>
                  <h3>Scheduler result</h3>
                  {schedulerResult ? (
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}>
                      <div><strong>Recommended order</strong></div>
                      <ol>
                        {(schedulerResult.recommendedOrder || []).map((t, i) => <li key={i}>{t}</li>)}
                      </ol>
                      {schedulerResult.diagnostics && schedulerResult.diagnostics.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <strong>Diagnostics</strong>
                          <ul>
                            {schedulerResult.diagnostics.map((d, idx) => <li key={idx} style={{ color: "#ff8a8a" }}>{d}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="muted">No scheduler run yet</div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
}

function AddTaskInline({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) { alert("Task title required"); return; }
    setSaving(true);
    try {
      await onSave(title.trim());
      setTitle("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input className="input" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }} />
      <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "..." : "Save"}</button>
      <button className="small-btn" onClick={() => { setTitle(""); onCancel(); }}>Cancel</button>
    </div>
  );
}
