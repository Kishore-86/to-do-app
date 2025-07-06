import { useEffect, useState } from "react"
import TaskCard from "@/components/TaskCard"
import AIButton from "@/components/AIButton"
import XPProgressBar from "@/components/XPProgressBar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getAllTasks, markTaskComplete } from "@/services/api"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [xp, setXP] = useState(120)
  const [level, setLevel] = useState(2)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks()
        setTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const handleTaskClick = (task) => {
    navigate(`/edit/${task._id}`)
  }

  const handleToggleStatus = async (task) => {
    try {
      const updated = await markTaskComplete(task._id, task.status !== "completed")
      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? { ...t, status: updated.status } : t
      )
      setTasks(updatedTasks)

      // XP logic (example only)
      if (updated.status === "completed") {
        setXP((prevXP) => prevXP + 20)
        if ((xp + 20) % 100 === 0) setLevel((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error updating task status", error)
    }
  }

  const handleAISort = async () => {
    setAiLoading(true)
    try {
      // You could call an AI endpoint here
      const sorted = [...tasks].sort((a, b) => {
        const priorityMap = { high: 3, medium: 2, low: 1 }
        return priorityMap[b.priority] - priorityMap[a.priority]
      })
      setTasks(sorted)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <XPProgressBar xp={xp} level={level} />
        </div>

        <div className="flex gap-3">
          <AIButton onClick={handleAISort} loading={aiLoading} />
          <Button onClick={() => navigate("/create")}>
            <Plus className="w-4 h-4 mr-1" />
            New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tasks yet. Add one!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={handleTaskClick}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}
