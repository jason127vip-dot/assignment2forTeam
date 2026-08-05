import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskSummary from "./TaskSummary";

function Dashboard({ session, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const statusCounts = useMemo(
    () =>
      tasks.reduce(
        (counts, task) => ({
          ...counts,
          [task.status]: (counts[task.status] || 0) + 1,
        }),
        { todo: 0, in_progress: 0, completed: 0 },
      ),
    [tasks],
  );

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiRequest("/tasks/", {}, session.token);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function createTask(form) {
    setError("");
    const task = await apiRequest(
      "/tasks/",
      {
        method: "POST",
        body: JSON.stringify(form),
      },
      session.token,
    );
    setTasks((current) => [task, ...current]);
  }

  async function updateTask(taskId, payload) {
    setError("");
    const updated = await apiRequest(
      `/tasks/${taskId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      session.token,
    );
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  }

  async function removeTask(taskId) {
    setError("");
    await apiRequest(`/tasks/${taskId}/`, { method: "DELETE" }, session.token);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout/", { method: "POST" }, session.token);
    } finally {
      onLogout();
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">TaskSphere Dashboard</span>
          <h1>Welcome, {session.user.username}</h1>
        </div>
        <button className="ghost-action" type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <TaskSummary statusCounts={statusCounts} />

      <section className="workspace-grid">
        <TaskForm onCreate={createTask} onError={setError} />
        <TaskList
          tasks={tasks}
          error={error}
          isLoading={isLoading}
          onRefresh={loadTasks}
          onUpdate={updateTask}
          onRemove={removeTask}
          onError={setError}
        />
      </section>
    </main>
  );
}

export default Dashboard;
