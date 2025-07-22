import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import "@/index.css"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Shared from "@/pages/Shared"
import Profile from "@/pages/Profile"
import TaskForm from "@/components/TaskForm"
<<<<<<< HEAD
import { Toaster } from "react-hot-toast"

function ErrorBoundary({ children }) {
  return children
}
=======
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shared" element={<Shared />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create" element={<TaskForm mode="create" />} />
            <Route path="edit/:id" element={<TaskForm mode="edit" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
// Do NOT put any code after this line!
