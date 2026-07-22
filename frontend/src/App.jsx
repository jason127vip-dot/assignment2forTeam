import { useState } from "react";
import AuthPage from "./auth/AuthPage";
import Dashboard from "./dashboard/Dashboard";

function App() {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("tasksphere-session");
    return raw ? JSON.parse(raw) : null;
  });

  function handleAuthenticated(data) {
    localStorage.setItem("tasksphere-session", JSON.stringify(data));
    setSession(data);
  }

  function handleLogout() {
    localStorage.removeItem("tasksphere-session");
    setSession(null);
  }

  return session ? (
    <Dashboard session={session} onLogout={handleLogout} />
  ) : (
    <AuthPage onAuthenticated={handleAuthenticated} />
  );
}

export default App;
