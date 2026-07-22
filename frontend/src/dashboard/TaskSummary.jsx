function TaskSummary({ statusCounts }) {
  return (
    <section className="summary-grid" aria-label="Task summary">
      <article>
        <strong>{statusCounts.todo}</strong>
        <span>To Do</span>
      </article>
      <article>
        <strong>{statusCounts.in_progress}</strong>
        <span>In Progress</span>
      </article>
      <article>
        <strong>{statusCounts.completed}</strong>
        <span>Completed</span>
      </article>
    </section>
  );
}

export default TaskSummary;
