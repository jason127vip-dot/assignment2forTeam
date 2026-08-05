import { useState } from "react";

const EMPTY_EDIT_FORM = { title: "", description: "", status: "todo" };

function TaskList({ tasks, error, isLoading, onRefresh, onUpdate, onRemove, onError }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks =
    statusFilter === "all" ? tasks : tasks.filter((task) => task.status === statusFilter);

  function startEditing(task) {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditForm(EMPTY_EDIT_FORM);
  }

  async function saveTask(event, taskId) {
    event.preventDefault();
    onError("");

    try {
      await onUpdate(taskId, editForm);
      cancelEditing();
    } catch (err) {
      onError(err.message);
    }
  }

  async function updateTaskStatus(task, status) {
    try {
      await onUpdate(task.id, { status });
    } catch (err) {
      onError(err.message);
    }
  }

  async function removeTask(task) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) {
      return;
    }

    try {
      await onRemove(task.id);
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <section className="task-list" aria-label="Tasks">
      <div className="section-heading">
        <h2>My tasks</h2>
        <div className="task-actions">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter tasks by status"
          >
            <option value="all">All tasks</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="text-action" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {isLoading && <p className="empty-state">Loading tasks...</p>}
      {!isLoading && tasks.length === 0 && (
        <p className="empty-state">No tasks yet. Create your first task.</p>
      )}
      {!isLoading && tasks.length > 0 && filteredTasks.length === 0 && (
        <p className="empty-state">No tasks match the selected status.</p>
      )}
      <div className="task-stack">
        {filteredTasks.map((task) => (
          <article className="task-card" key={task.id}>
            {editingTaskId === task.id ? (
              <form className="edit-task-form" onSubmit={(event) => saveTask(event, task.id)}>
                <label>
                  Title
                  <input
                    value={editForm.title}
                    onChange={(event) => setEditForm({ ...editForm, title: event.target.value })}
                    required
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm({ ...editForm, description: event.target.value })
                    }
                    rows="3"
                  />
                </label>
                <label>
                  Status
                  <select
                    value={editForm.status}
                    onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <div className="task-actions">
                  <button className="primary-action" type="submit">
                    Save
                  </button>
                  <button type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) => updateTaskStatus(task, event.target.value)}
                    aria-label={`Status for ${task.title}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button type="button" onClick={() => startEditing(task)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => removeTask(task)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default TaskList;
