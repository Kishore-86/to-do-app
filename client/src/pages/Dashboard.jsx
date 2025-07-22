import { useEffect, useState } from "react"
import TaskCard from "@/components/TaskCard"
import { getTasks, updateTask, deleteTask } from "@/services/api"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    const data = await getTasks({ status: filter === "all" ? undefined : filter })
    setTasks(data)
  }

  const handleToggleStatus = async (task) => {
    await updateTask(task._id, { status: task.status === "completed" ? "pending" : "completed" })
    fetchTasks()
  }

  const handleDelete = async (task) => {
    await deleteTask(task._id)
    fetchTasks()
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button onClick={() => navigate("/create")}>+ New Task</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "pending", "in-progress", "completed"].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f)}
          >{f[0].toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onToggleStatus={handleToggleStatus}
            onEdit={() => {/* open edit modal */}}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}