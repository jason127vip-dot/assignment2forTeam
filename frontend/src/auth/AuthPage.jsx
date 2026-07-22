import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-label="Authentication">
        <div className="brand-block">
          <span className="brand-mark">TS</span>
          <div>
            <h1>TaskSphere</h1>
            <p>Manage daily tasks for small teams and freelancers.</p>
          </div>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onAuthenticated={onAuthenticated} />
        ) : (
          <RegisterForm onAuthenticated={onAuthenticated} />
        )}
      </section>
    </main>
  );
}

export default AuthPage;
