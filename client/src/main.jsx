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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
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
  </React.StrictMode>
)
