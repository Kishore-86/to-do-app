import { useEffect, useState } from "react"
import { TaskCard } from "@/components/TaskCard"
import { getTasks } from "@/services/api"
import toast from "react-hot-toast"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks({ status: filter === "all" ? undefined : filter })
      setTasks(data)
    } catch (err) {
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (task) => {
    await updateTask(task._id, { status: task.status === "completed" ? "pending" : "completed" })
    fetchTasks()
    toast.success("Task status updated")
  }

  const handleDelete = async (task) => {
    await deleteTask(task._id)
    fetchTasks()
    toast.success("Task deleted")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-4">
        {["all", "pending", "in-progress", "completed"].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f)}
          >{f[0].toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <span className="text-muted-foreground">Loading tasks...</span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No tasks found.
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}