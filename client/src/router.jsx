import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Shared from "@/pages/Shared"
import Profile from "@/pages/Profile"
import TaskForm from "@/pages/TaskForm"
import { isAuthenticated } from "@/services/auth"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/shared"
          element={
            isAuthenticated() ? <Shared /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create"
          element={
            isAuthenticated() ? <TaskForm mode="create" /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/edit/:id"
          element={
            isAuthenticated() ? <TaskForm mode="edit" /> : <Navigate to="/login" replace />
          }
        />

        {/* Default route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  )
}
