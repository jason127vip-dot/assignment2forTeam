import { useState } from "react";
import { apiRequest } from "../api/client";

function LoginForm({ onAuthenticated }) {
  const savedUsername = localStorage.getItem("rememberedUsername") || "";

  const [form, setForm] = useState({
    username: savedUsername,
    password: "",
  });

  const [rememberUsername, setRememberUsername] = useState(
    Boolean(savedUsername)
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

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

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const trimmedUsername = form.username.trim();

    try {
      const loginDetails = {
        username: trimmedUsername,
        password: form.password,
      };

      const data = await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      if (rememberUsername) {
        localStorage.setItem("rememberedUsername", trimmedUsername);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      onAuthenticated(data);
    } catch (err) {
      setError(
        err.message ||
          "Login failed. Please check your username and password and try again."
      );

      // Clear the password after an unsuccessful login attempt.
      setForm((current) => ({
        ...current,
        password: "",
      }));

      // Return the password input to its hidden state.
      setShowPassword(false);
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
        maxLength={50}
        disabled={isSubmitting}
        aria-invalid={Boolean(error)}
        required
        autoFocus
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
        disabled={isSubmitting || !form.password}
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? "Hide password" : "Show password"}
      </button>

      <label className="remember-username">
        <input
          type="checkbox"
          checked={rememberUsername}
          disabled={isSubmitting}
          onChange={(event) => setRememberUsername(event.target.checked)}
        />
        Remember username
      </label>

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