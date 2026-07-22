import { useState } from "react";
import { apiRequest } from "../api/client";

function LoginForm({ onAuthenticated }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { username, password } = form;
      const data = await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAuthenticated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label>
        Username
        <input
          name="username"
          value={form.username}
          onChange={updateField}
          autoComplete="username"
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          autoComplete="current-password"
          minLength={8}
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="primary-action" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
