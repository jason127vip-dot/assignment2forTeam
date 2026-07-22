import { useState } from "react";

const EMPTY_TASK_FORM = { title: "", description: "", status: "todo" };

function TaskForm({ onCreate, onError }) {
  const [form, setForm] = useState(EMPTY_TASK_FORM);

  async function handleSubmit(event) {
    event.preventDefault();
    onError("");

    try {
      await onCreate(form);
      setForm(EMPTY_TASK_FORM);
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create task</h2>
      <label>
        Title
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
      </label>
      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          rows="5"
        />
      </label>
      <label>
        Status
        <select
          value={form.status}
          onChange={(event) => setForm({ ...form, status: event.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button className="primary-action" type="submit">
        Add task
      </button>
    </form>
  );
}

export default TaskForm;
