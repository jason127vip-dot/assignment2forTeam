import { useState } from "react";
import { apiRequest } from "../api/client";

function LoginForm({ onAuthenticated }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear the previous error when the user changes a field.
    if (error) {
      setError("");
    }
  }

  function validateForm() {
    if (!form.username.trim()) {
      setError("Please enter your username.");
      return false;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return false;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loginDetails = {
        username: form.username.trim(),
        password: form.password,
      };

      const data = await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      onAuthenticated(data);
    } catch (err) {
      setError(
        err.message || "Login failed. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <label htmlFor="login-username">Username</label>
      <input
        id="login-username"
        name="username"
        type="text"
        value={form.username}
        onChange={updateField}
        autoComplete="username"
        disabled={isSubmitting}
        aria-invalid={Boolean(error)}
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={updateField}
        autoComplete="current-password"
        disabled={isSubmitting}
        aria-invalid={Boolean(error)}
        required
      />

      <button
        className="text-action"
        type="button"
        aria-pressed={showPassword}
        aria-controls="login-password"
        disabled={isSubmitting}
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? "Hide password" : "Show password"}
      </button>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="primary-action"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p className="sr-only" aria-live="polite">
        {isSubmitting ? "Login request is being processed." : ""}
      </p>
    </form>
  );
}

export default LoginForm;